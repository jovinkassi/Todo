import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Modal from './Modal';
import { ITask } from '@/types/tasks';

interface AddTaskProps {
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>; // Prop to update tasks
  userId: string; // Accept userId as prop
}

const AddTask: React.FC<AddTaskProps> = ({ setTasks, userId }) => {
  console.log(userId); // Check userId
  const [modalOpen, setModalOpen] = useState(false);
  const [newTaskValue, setNewTaskValue] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'pending' | 'completed'>('pending'); // Default status

  const handleSubmitNewTodo = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Create task object
    const newTask: ITask = {
      id: Math.random().toString(), // Temporary ID, will be replaced with actual db ID
      title: newTaskValue,
      description: newTaskDescription,
      status: newTaskStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  
    console.log('Sending task to backend:', newTask);
  
    // Send the task and userId to the backend
    try {
        // Send the task and userId to the backend
        const response = await fetch(`/api/user/${userId}/add-task`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newTask, // Send task
            userId, // Send userId
          }),
        });

        const data = await response.json();
        console.log(data);

  
        if (response.ok) {
            console.log(response)
          setTasks((prevTasks) => [...prevTasks, newTask]); // Update the tasks in state
          setNewTaskValue('');
          setNewTaskDescription('');
          setNewTaskStatus('pending');
          setModalOpen(false);
        } else {
          const errorData = await response.json();
          console.error('Error response from server:', errorData);
          alert('Failed to add task');
        }
      } catch (error) {
        console.error('An error occurred while adding the task:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    };
  

  return (
    <div>
      <button onClick={() => setModalOpen(true)} className="btn btn-primary w-full">
        Add New Task <AiOutlinePlus className="ml-2" size={18} />
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewTodo}>
          <h3 className="font-bold text-lg">Add New Task</h3>

          <div className="modal-action">
            <input
              type="text"
              placeholder="Task Title"
              className="input input-bordered w-full"
              value={newTaskValue}
              onChange={(e) => setNewTaskValue(e.target.value)}
            />
            <textarea
              placeholder="Task Description"
              className="input input-bordered w-full"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <select
              className="input input-bordered w-full"
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value as 'pending' | 'completed')}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddTask;
