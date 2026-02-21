// page.tsx
"use client";
import { useEffect, useState } from 'react';
import Authentication from '@/components/Authentication';
import AddTask from '@/components/AddTask';
import TodoList from '@/components/TodoList';
import { ITask } from '@/types/tasks';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    if (userId) {
      const fetchTasks = async () => {
        try {
          const response = await fetch(`/api/user/${userId}/add-task`);
          const data = await response.json();
          if (data.success) {
            setTasks(data.tasks);
          } else {
            console.error('Failed to fetch tasks:', data.error);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
      fetchTasks();
    }
  }, [userId]);

  if (!isLoggedIn) {
    return <Authentication setLoggedIn={setIsLoggedIn} setUserId={setUserId} />;
  }

  const pending = tasks.filter((t) => t.status === 'pending').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Vaultask</span>
          </div>
          <span className="text-slate-500 text-sm font-medium">Task Dashboard</span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-white mt-1">{tasks.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">{pending}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{completed}</p>
          </div>
        </div>

        {/* Tasks panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-white font-semibold text-lg">My Tasks</h2>
            <AddTask setTasks={setTasks} userId={userId} />
          </div>
          <TodoList tasks={tasks} userId={userId} setTasks={setTasks} />
        </div>
      </main>
    </div>
  );
}
