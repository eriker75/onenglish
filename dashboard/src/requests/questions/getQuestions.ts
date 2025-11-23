import api from '@/src/config/axiosInstance';
import { AxiosError } from 'axios';
import { GetQuestionsFilters } from '@/src/definitions/dtos/requests/questions';
import { QuestionResponseDto } from '@/src/definitions/dtos/responses/questions';

export default async function getQuestions(
  filters: GetQuestionsFilters
): Promise<QuestionResponseDto[]> {
  try {
    const response = await api.get<QuestionResponseDto[]>('/questions', {
      params: filters,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error fetching questions:', error.message);
      throw error;
    } else {
      console.error('Unexpected error fetching questions:', error);
      throw new Error('Error fetching questions');
    }
  }
}
