import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBug, updateBugStatus, assignBug } from '../api/bug.api';
import { getComments, addComment } from '../api/comment.api';
import { getDevelopers } from '../api/auth.api';
import { suggestAssignee } from '../api/ai.api';
import { User, MessageSquare, Send, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BugDetail = () => {
  const { bugId } = useParams();
  const [bug, setBug] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    Promise.all([
      getBug(bugId),
      getComments(bugId),
      getDevelopers()
    ]).then(([bugRes, commRes, devRes]) => {
      setBug(bugRes.data);
      setComments(commRes.data);
      setDevelopers(devRes.data);
    });
  }, [bugId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await addComment({ bugId, content: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateBugStatus(bugId, newStatus);
      setBug(res.data);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSmartAssign = async () => {
    setIsAssigning(true);
    try {
      const res = await suggestAssignee(bugId, bug.category);
      const suggestedId = res.data.userId;
      await assignBug(bugId, suggestedId);
      const bugRes = await getBug(bugId);
      setBug(bugRes.data);
      toast.success('AI suggested and assigned developer!');
    } catch (err) {
      toast.error('Smart Assign failed');
    } finally {
      setIsAssigning(false);
    }
  };

  if (!bug) return <div>Loading bug...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 space-y-8">
        <header>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{bug.bugKey}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
              ${bug.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {bug.priority} PRIORITY
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900">{bug.title}</h1>
        </header>

        <section className="card">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-primary" />
            Description
          </h3>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
            {bug.description || 'No description provided.'}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            Comments ({comments.length})
          </h3>
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="card !p-4 bg-white/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <span className="font-bold text-sm">User {comment.authorId.substring(0, 5)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{comment.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input-field"
              placeholder="Add a comment..."
            />
            <button type="submit" className="btn-primary flex items-center justify-center w-12 h-12 !p-0">
              <Send size={20} />
            </button>
          </form>
        </section>
      </div>

      <div className="space-y-6">
        <section className="card space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all
                    ${bug.status === status ? 'bg-primary text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Assignee</label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {bug.assigneeId ? `Dev ${bug.assigneeId.substring(0, 8)}` : 'Unassigned'}
                  </p>
                  <p className="text-xs text-slate-500">{bug.category || 'No category'}</p>
                </div>
              </div>
              <button 
                onClick={handleSmartAssign}
                disabled={isAssigning}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles size={18} />
                {isAssigning ? 'Thinking...' : 'AI Smart Assign'}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-3">
             <div className="flex justify-between text-xs font-bold">
               <span className="text-slate-400 uppercase">Reporter</span>
               <span className="text-slate-900">User {bug.reporterId.substring(0, 8)}</span>
             </div>
             <div className="flex justify-between text-xs font-bold">
               <span className="text-slate-400 uppercase">Created</span>
               <span className="text-slate-900 flex items-center gap-1">
                 <Clock size={12} /> {new Date(bug.createdAt).toLocaleDateString()}
               </span>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BugDetail;
