import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ITask } from '@/types/tasks'; // Import your task type

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    // Parse the incoming request to extract userId and taskId
    const rawBody = await req.text();
    console.log('Received raw delete:', rawBody);

    const { userId, taskId } = JSON.parse(rawBody);
    console.log(userId,taskId)

    if (!userId || !taskId) {
      console.error('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch the user with their todos array
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { todos: true }, // Only fetch the 'todos' array
    });

    if (!user) {
      console.error('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Filter out the task that matches the taskId
    const updatedTodos = user.todos.filter((task: ITask) => task.id !== taskId);

    // Update the user record with the updated todos array
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        todos: updatedTodos, // Set the new todos array
      },
    });

    console.log('Updated User:', updatedUser);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
