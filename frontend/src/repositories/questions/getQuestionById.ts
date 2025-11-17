import api from '@/src/config/axiosInstance';
import { AxiosError } from 'axios';
import { QuestionResponseDto } from '@/src/definitions/dtos/responses/questions';

export default async function getQuestionById(
  id: string
): Promise<QuestionResponseDto> {
  try {
    const response = await api.get<QuestionResponseDto>(`/questions/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error fetching question by id:', error.message);
      throw error;
    } else {
      console.error('Unexpected error fetching question by id:', error);
      throw new Error('Error fetching question by id');
    }
  }
}
