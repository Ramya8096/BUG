import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getBugs, updateBugStatus } from '../api/bug.api';
import { getProject } from '../api/project.api';
import { Plus, User, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const COLUMNS = [
  { id: 'OPEN', title: 'Open', icon: <AlertCircle className="text-status-open" /> },
  { id: 'IN_PROGRESS', title: 'In Progress', icon: <Clock className="text-status-in-progress" /> },
  { id: 'RESOLVED', title: 'Resolved', icon: <CheckCircle2 className="text-status-resolved" /> },
  { id: 'CLOSED', title: 'Closed', icon: <XCircle className="text-status-closed" /> },
];

const ProjectBoard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProject(projectId),
      getBugs(projectId)
    ]).then(([projRes, bugsRes]) => {
      setProject(projRes.data);
      const grouped = COLUMNS.reduce((acc, col) => {
        acc[col.id] = bugsRes.data.filter(b => b.status === col.id);
        return acc;
      }, {});
      setBugs(grouped);
    }).finally(() => setLoading(false));
  }, [projectId]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const bugId = draggableId;
    const newStatus = destination.droppableId;
    const oldStatus = source.droppableId;

    // Optimistic UI update
    const sourceList = Array.from(bugs[oldStatus]);
    const destList = Array.from(bugs[newStatus]);
    const [movedBug] = sourceList.splice(source.index, 1);
    movedBug.status = newStatus;
    destList.splice(destination.index, 0, movedBug);

    setBugs({
      ...bugs,
      [oldStatus]: sourceList,
      [newStatus]: destList
    });

    try {
      await updateBugStatus(bugId, newStatus);
      toast.success(`Bug moved to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update bug status');
      // Revert if failed (omitted for brevity)
    }
  };

  if (loading) return <div>Loading board...</div>;

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{project?.name} Board</h1>
          <p className="text-slate-500">Manage and track bugs for {project?.projectKey}</p>
        </div>
        <Link to={`/projects/${projectId}/bugs/new`} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Report Bug</span>
        </Link>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
          {COLUMNS.map(column => (
            <div key={column.id} className="min-w-[300px] flex-1 flex flex-col bg-slate-100/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  {column.icon}
                  <span>{column.title}</span>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs ml-1 shadow-sm">
                    {bugs[column.id]?.length || 0}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 space-y-4 min-h-[100px]"
                  >
                    {bugs[column.id]?.map((bug, index) => (
                      <Draggable key={bug.id} draggableId={bug.id} index={index}>
                        {(provided) => (
                          <Link
                            to={`/bugs/${bug.id}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="card !p-4 hover:border-primary/30 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-slate-400 group-hover:text-primary transition-colors">
                                {bug.bugKey}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                                ${bug.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 
                                  bug.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                {bug.priority}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-4 line-clamp-2">{bug.title}</h4>
                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                  <User size={12} />
                                </div>
                                <span>{bug.assigneeId ? 'Assigned' : 'Unassigned'}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {new Date(bug.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </Link>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectBoard;
