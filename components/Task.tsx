"use client";

import { ITask } from "@/types/tasks";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";

interface TaskProps {
  task: ITask;
  userId: string;
  onTaskUpdated: () => void;
}

const Task: React.FC<TaskProps> = ({ task, userId, onTaskUpdated }) => {
  const router = useRouter();

  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.title);
  const [descriptionToEdit, setDescriptionToEdit] = useState<string>(task.description);
  const [statusToEdit, setStatusToEdit] = useState<string>(task.status);

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const updatedTask = {
      title: taskToEdit,
      description: descriptionToEdit,
      status: statusToEdit,
    };

    const payload = {
      userId,
      taskId: task.id,
      updatedTask,
    };

    try {
      const response = await fetch(`/api/user/${userId}/update-task`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setOpenModalEdit(false);
        onTaskUpdated();
        router.refresh();
      } else {
        console.error('Failed to update task:', data.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setOpenModalDeleted(false);

    const payload = { userId, taskId: id };

    try {
      const response = await fetch(`/api/user/${userId}/delete-task`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        router.refresh();
        onTaskUpdated();
      } else {
        console.error("Failed to delete task:", data.error);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <tr className="hover:bg-slate-800/40 transition-colors duration-150">
      <td className="px-6 py-4 text-white font-medium text-sm">{task.title}</td>
      <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{task.description}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            task.status === 'completed'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
        >
          {task.status === 'completed' ? 'Completed' : 'Pending'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenModalEdit(true)}
            className="text-slate-500 hover:text-indigo-400 transition-colors duration-150"
            title="Edit task"
          >
            <FiEdit size={17} />
          </button>
          <button
            onClick={() => setOpenModalDeleted(true)}
            className="text-slate-500 hover:text-red-400 transition-colors duration-150"
            title="Delete task"
          >
            <FiTrash2 size={17} />
          </button>
        </div>

        {/* Edit modal */}
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <h3 className="text-white font-bold text-lg mb-5">Edit Task</h3>
          <form onSubmit={handleSubmitEditTodo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type="text"
                placeholder="Title"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <input
                value={descriptionToEdit}
                onChange={(e) => setDescriptionToEdit(e.target.value)}
                type="text"
                placeholder="Description"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
              <select
                value={statusToEdit}
                onChange={(e) => setStatusToEdit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200 mt-2"
            >
              Save Changes
            </button>
          </form>
        </Modal>

        {/* Delete confirmation modal */}
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-400" size={22} />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Delete Task</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete &quot;{task.title}&quot;? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenModalDeleted(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
