"use client";

import { ITask } from "@/types/tasks";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";

interface TaskProps {
  task: ITask;
  userId: string; // Add userId as a prop
  onTaskUpdated: () => void;
}

const Task: React.FC<TaskProps> = ({ task, userId , onTaskUpdated}) => {
  const router = useRouter();

  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.title);
  const [descriptionToEdit, setDescriptionToEdit] = useState<string>(task.description);
  const [statusToEdit, setStatusToEdit] = useState<string>(task.status);

  // Handle submit of the edited task
  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  
    // Create the payload for updating the task
    const updatedTask = {
      title: taskToEdit,  // Ensure taskToEdit is a valid string
      description: descriptionToEdit,  // Use current description
      status: statusToEdit,  // Same with status
    };
  
    const payload = {
      userId: userId,  // Assuming userId is available in the context
      taskId: task.id,
      updatedTask,
    };
  
    try {
      const response = await fetch(`/api/user/${userId}/update-task`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setOpenModalEdit(false);  // Close modal
        onTaskUpdated();
        router.refresh();  // Refresh or update UI
      } else {
        console.error('Failed to update task:', data.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id: string) => {
    setOpenModalDeleted(false);

    const payloadd = {
        userId: userId,  // Assuming userId is available in the context
        taskId: id,
       
      };
      console.log('Payload to delete:', payloadd);
   

    try {

       
      const response = await fetch(`/api/user/${userId}/delete-task`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadd ),
      });

      const data = await response.json();

      if (data.success) {
        router.refresh(); // Refresh the page after deletion
        onTaskUpdated();
      } else {
        console.error("Failed to delete task:", data.error);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <tr key={task.id}>
      <td>{task.title}</td>
      <td>{task.description}</td>
      <td>
  <span
    className={`${
      task.status === "completed" ? "text-green-500" : "text-red-500"
    } font-semibold`}
  >
    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
       </span>
      </td>
      <td className="flex items-center gap-4">
        <FiEdit onClick={() => setOpenModalEdit(true)} cursor="pointer" className="text-blue-500" size={25} />
        <FiTrash2 onClick={() => setOpenModalDeleted(true)} cursor="pointer" className="text-red-500" size={25} />


        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className="font-bold text-lg">Edit Task</h3>

            <div className="modal-action">
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type="text"
                placeholder="Title"
                className="input input-bordered w-full"
              />

              <input
                value={descriptionToEdit}
                onChange={(e) => setDescriptionToEdit(e.target.value)}
                type="text"
                placeholder="Description"
                className="input input-bordered w-full mt-2"
              />

<select
        value={statusToEdit}
        onChange={(e) => setStatusToEdit(e.target.value)}
        className="select select-bordered w-full mt-2"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

              <button type="submit" className="btn mt-4">
                Submit
              </button>
            </div>
          </form>
        </Modal>


        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className="text-lg">Are you sure to delete the task?</h3>
          <div className="modal-action">
            <button onClick={() => handleDeleteTask(task.id)} className="btn">
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
