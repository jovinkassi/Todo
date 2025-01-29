export interface ITask {
    id: string; // ID is now an incrementing number
    title: string;
    description: string;
    status: 'pending' | 'completed'; // You can also use a string literal union for status
    createdAt: string;
    updatedAt: string;
  }