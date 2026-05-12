import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/project.api';
import { Folder, Plus, ArrowRight, LayoutGrid } from 'lucide-react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-lg">Overview of your active projects and bug tracking status.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-6 py-3">
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-slate-100" />
          ))
        ) : projects.length > 0 ? (
          projects.map(project => (
            <Link 
              key={project.id} 
              to={`/projects/${project.id}/board`}
              className="card group hover:border-primary/50 hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Folder size={24} />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                  {project.projectKey}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                {project.description || 'No description provided.'}
              </p>
              <div className="flex items-center text-primary font-bold text-sm">
                View Board <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
              <LayoutGrid size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No projects yet</h2>
            <p className="text-slate-500 mb-8">Start by creating your first project to track bugs.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
