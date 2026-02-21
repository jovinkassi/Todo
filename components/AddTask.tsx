import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Modal from './Modal';
import { ITask } from '@/types/tasks';

interface AddTaskProps {
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  userId: string;
}

const AddTask: React.FC<AddTaskProps> = ({ setTasks, userId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newTaskValue, setNewTaskValue] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'pending' | 'completed'>('pending');

  const handleSubmitNewTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: ITask = {
      id: Math.random().toString(),
      title: newTaskValue,
      description: newTaskDescription,
      status: newTaskStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`/api/user/${userId}/add-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newTask, userId }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setNewTaskValue('');
        setNewTaskDescription('');
        setNewTaskStatus('pending');
        setModalOpen(false);
      } else {
        console.error('Error response from server:', data);
        alert('Failed to add task');
      }
    } catch (error) {
      console.error('An error occurred while adding the task:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition duration-200"
      >
        <AiOutlinePlus size={16} />
        Add Task
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <h3 className="text-white font-bold text-lg mb-5">New Task</h3>
        <form onSubmit={handleSubmitNewTodo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
            <input
              type="text"
              placeholder="Task title"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              value={newTaskValue}
              onChange={(e) => setNewTaskValue(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              placeholder="Describe the task..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value as 'pending' | 'completed')}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200 mt-2"
          >
            Create Task
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AddTask;
