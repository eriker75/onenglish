import api from '@/src/config/axiosInstance';
import { AxiosError } from 'axios';

export default async function deleteQuestion(id: string): Promise<void> {
  try {
    await api.delete(`/questions/${id}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error deleting question:', error.message);
      console.error('Error details:', error.response?.data);
      throw error;
    } else {
      console.error('Unexpected error deleting question:', error);
      throw new Error('Error deleting question');
    }
  }
}
