import {  NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Extract the task and userId from the request body
    const rawBody = await req.text(); // Read the raw body as text first
    console.log('Received raw body:', rawBody);  // Log the raw body for debugging
    //const { newTask, userId } = await req.json();
    const { newTask, userId } = JSON.parse(rawBody);
    console.log('Received Task:', newTask);
    console.log('Received User ID:', userId);
   

    // Validate inputs
    if (!userId) {
      console.error('User ID is missing');
      return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
    }

    if (!newTask || !newTask.title || !newTask.description || !newTask.status || !newTask.createdAt || !newTask.updatedAt) {
      console.error('Invalid task data:', newTask);
      return NextResponse.json({ error: 'Invalid task data' }, { status: 400 });
    }
   
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { todos: true },  // Only fetch the todos array
    });

    if (!user) {
      console.error('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentTodos = Array.isArray(user.todos) ? user.todos : [];

    const updatedTodos = [...currentTodos, newTask]; // Append the new task

    // Update the user with the new todos array
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        todos: updatedTodos, // Set the updated todos array
      },
    });
    console.log('Updated User:', updatedUser);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error during task addition:',error);
    return NextResponse.json({ error: 'Failed to add task', details: error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // Parse the URL of the request
    const userId = url.pathname.split('/')[3]; // Extract userId from the URL
    console.log("userrrr",userId);
   

    if (!userId) {
      console.error('User ID is missing');
      return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
    }

    // Fetch user and their tasks (todos) from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { todos: true }, // Fetch only the 'todos' field
    });

    if (!user) {
      console.error('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, tasks: user.todos });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks', details: error }, { status: 500 });
  }
}
