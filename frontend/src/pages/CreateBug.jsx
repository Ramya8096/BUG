import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createBug } from '../api/bug.api';
import { getProject } from '../api/project.api';
import { classifyBug, findSimilarBugs } from '../api/ai.api';
import { Sparkles, AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateBug = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  
  const [project, setProject] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [similarBugs, setSimilarBugs] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const title = watch('title');
  const description = watch('description');

  useEffect(() => {
    getProject(projectId).then(res => setProject(res.data));
  }, [projectId]);

  // AI Suggestion Debounce
  useEffect(() => {
    if (!title || !description || title.length < 5 || description.length < 10) return;

    const timer = setTimeout(async () => {
      setIsAiLoading(true);
      try {
        const [classRes, similarRes] = await Promise.all([
          classifyBug({ title, description }),
          findSimilarBugs({ title, description, projectId })
        ]);
        setAiSuggestion(classRes.data);
        // setSimilarBugs(similarRes.data);
      } catch (err) {
        console.error('AI Error', err);
      } finally {
        setIsAiLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, description, projectId]);

  const applyAi = () => {
    if (aiSuggestion) {
      setValue('priority', aiSuggestion.priority);
      setValue('category', aiSuggestion.category);
      setAiSuggestion(null);
      toast.success('AI suggestions applied!');
    }
  };

  const onSubmit = async (data) => {
    try {
      await createBug({ ...data, projectId }, project.projectKey);
      toast.success('Bug reported successfully!');
      navigate(`/projects/${projectId}/board`);
    } catch (err) {
      toast.error('Failed to report bug');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Board</span>
      </button>

      <header>
        <h1 className="text-4xl font-black text-slate-900">Report Bug</h1>
        <p className="text-slate-500">Provide details about the issue. Our AI will help classify it.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Bug Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="input-field text-lg"
              placeholder="e.g., Login button not responding on mobile"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              className="input-field min-h-[150px]"
              placeholder="Steps to reproduce, expected vs actual behavior..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
              <select {...register('priority')} className="input-field">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
              <select {...register('category')} className="input-field">
                <option value="UI">UI</option>
                <option value="BACKEND">Backend</option>
                <option value="DATABASE">Database</option>
                <option value="SECURITY">Security</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-lg font-bold">
            Report Bug
          </button>
        </form>

        {/* AI Banner */}
        {isAiLoading && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
            <Sparkles className="text-primary animate-spin" />
            <span className="text-primary font-medium">AI is analyzing your bug...</span>
          </div>
        )}

        {aiSuggestion && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg animate-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={24} />
                <h3 className="font-bold text-xl">AI Assistant Suggestions</h3>
              </div>
              <button 
                onClick={applyAi}
                className="px-4 py-1.5 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-md"
              >
                Apply AI Suggestions
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-blue-100 italic">"{aiSuggestion.reasoning}"</p>
              <div className="flex gap-4 mt-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  PRIORITY: {aiSuggestion.priority}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  CATEGORY: {aiSuggestion.category}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBug;
