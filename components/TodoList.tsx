// TodoList.tsx
import React from 'react'
import { ITask } from '@/types/tasks'
import Task from './Task';

interface TodoListProps {
  tasks: ITask[];  // Receive tasks as props
  userId: string;
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ tasks,userId, setTasks }) => {


  const handleTaskUpdated = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/add-task`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks); // Refresh tasks list after update
      } else {
        console.error("Failed to fetch tasks:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead> 
          <tbody>
            {tasks.map((task) => (<Task key={task.id} task={task} userId={userId} onTaskUpdated={handleTaskUpdated}/>))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList;
