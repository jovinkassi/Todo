import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ITask } from '@/types/tasks';  // Import your task type

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    // Extract userId, taskId, and updated task data from the request body
    const rawBody = await req.text();  // Read raw body first
    console.log('Received raw bodyyyyy:', rawBody);

    const { userId, taskId, updatedTask } = JSON.parse(rawBody);  // Parse the JSON payload

    if (!userId || !taskId || !updatedTask) {
      console.error('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the user and update the task inside the 'todos' array
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { todos: true },  // Only fetch the 'todos' array
    });

    if (!user) {
      console.error('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const todosArray = Array.isArray(user.todos) ? user.todos : user.todos ? JSON.parse(user.todos as string) : [];


    // Explicitly type the 'task' parameter as ITask
    const updatedTodos = todosArray.map((task: ITask) => {  // Explicitly type task
      if (task.id === taskId) {
        return {
          ...task,
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          updatedAt: new Date(),  // Update the timestamp
        };
      }
      return task;  // Return the task unchanged if it's not the one being updated
    });

    // Now, update the user record with the updated todos array
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        todos: updatedTodos,  // Replace the old todos array with the updated one
      },
    });

    console.log('Updated User:', updatedUser);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
