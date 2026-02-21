// TodoList.tsx
import React from 'react'
import { ITask } from '@/types/tasks'
import Task from './Task';

interface TodoListProps {
  tasks: ITask[];
  userId: string;
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, userId, setTasks }) => {
  const handleTaskUpdated = async () => {
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

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">No tasks yet</p>
        <p className="text-slate-600 text-sm mt-1">Click &quot;Add Task&quot; to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Task</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Description</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {tasks.map((task) => (
            <Task key={task.id} task={task} userId={userId} onTaskUpdated={handleTaskUpdated} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
