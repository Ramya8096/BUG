import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markNotificationRead } from '../api/notification.api';
import { Bell, Check, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(res => setNotifications(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'BUG_ASSIGNED': return <AlertCircle size={20} className="text-blue-500" />;
      case 'BUG_COMMENTED': return <MessageSquare size={20} className="text-green-500" />;
      default: return <Bell size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500">Stay updated on bug reports and team comments.</p>
        </div>
      </header>

      <div className="space-y-4">
        {loading ? (
          Array(5).fill(0).map((_, i) => <div key={i} className="card h-24 animate-pulse bg-slate-100" />)
        ) : notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`card flex items-start justify-between gap-4 transition-all
                ${notification.read ? 'opacity-60 bg-slate-50' : 'border-l-4 border-l-primary shadow-lg scale-[1.02]'}`}
            >
              <div className="flex gap-4">
                <div className={`p-3 rounded-2xl ${notification.read ? 'bg-slate-200 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                  {getIcon(notification.type)}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>
                    {notification.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-3">{notification.message}</p>
                  <div className="flex items-center gap-4">
                    <Link 
                      to={`/bugs/${notification.relatedBugId}`}
                      className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
                    >
                      View Bug details
                    </Link>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              {!notification.read && (
                <button 
                  onClick={() => handleMarkRead(notification.id)}
                  className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="card text-center py-20">
            <Bell size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">All caught up!</h3>
            <p className="text-slate-400">No new notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
