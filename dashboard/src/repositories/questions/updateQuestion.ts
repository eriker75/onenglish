import api from '@/src/config/axiosInstance';
import { AxiosError } from 'axios';
import { UpdateQuestionDto } from '@/src/definitions/dtos/requests/questions';
import { QuestionResponseDto } from '@/src/definitions/dtos/responses/questions';

export default async function updateQuestion(
  id: string,
  data: UpdateQuestionDto | FormData
): Promise<QuestionResponseDto> {
  try {
    const isFormData = data instanceof FormData;

    const response = await api.patch<QuestionResponseDto>(
      `/questions/${id}`,
      data,
      {
        headers: isFormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error updating question:', error.message);
      console.error('Error details:', error.response?.data);
      throw error;
    } else {
      console.error('Unexpected error updating question:', error);
      throw new Error('Error updating question');
    }
  }
}
