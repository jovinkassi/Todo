// page.tsx
"use client";
import { useEffect, useState } from 'react';
import Authentication from '@/components/Authentication';
import AddTask from '@/components/AddTask';
import TodoList from '@/components/TodoList';
import { ITask } from '@/types/tasks';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Manage logged-in state
  const [tasks, setTasks] = useState<ITask[]>([]); // Initialize tasks as empty
  const [userId, setUserId] = useState<string>(''); // Manage user ID state

 
  useEffect(() => {
    // Fetch tasks when the user is logged in
    if (userId) {
      const fetchTasks = async () => {
        try {
          const response = await fetch(`/api/user/${userId}/add-task`); // Adjust the URL accordingly
          const data = await response.json();
          if (data.success) {
            setTasks(data.tasks); // Set tasks from backend response
          } else {
            console.error('Failed to fetch tasks:', data.error);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    }
  }, [userId]); // Run the effect whenever `userId` changes

 
 
 
 
  return (
    <main className="max-w-4xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Your Todos List</h1>

        {!isLoggedIn ? (
          // If not logged in, show Authentication component
          <Authentication setLoggedIn={setIsLoggedIn} setUserId={setUserId} />
          
        ) : (
          // If logged in, show the to-do list and add task components
          <>
     
            <AddTask setTasks={setTasks} userId={userId}/>
            <TodoList  tasks={tasks} userId={userId}  setTasks={setTasks}/>
          </>
        )}
      </div>
    </main>
  );
}
