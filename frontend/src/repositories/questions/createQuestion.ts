import api from '@/src/config/axiosInstance';
import { AxiosError } from 'axios';
import { QuestionResponseDto } from '@/src/definitions/dtos/responses/questions';
import { QuestionType } from '@/src/definitions/types/Question';
import { QUESTION_TYPE_ENDPOINTS } from '@/src/definitions/types/Question';

/**
 * Create a question of any type
 *
 * @param type - Question type (e.g., 'image_to_multiple_choices')
 * @param data - Question data (DTO for the specific type)
 * @returns Created question
 *
 * @example
 * // For questions with media (multipart/form-data)
 * const formData = new FormData();
 * formData.append('challengeId', challengeId);
 * formData.append('stage', 'VOCABULARY');
 * formData.append('phase', 'phase_1');
 * formData.append('points', '10');
 * formData.append('media', imageFile);
 * formData.append('options', 'cat,dog,bird,fish');
 * formData.append('answer', 'cat');
 *
 * await createQuestion('image_to_multiple_choices', formData);
 *
 * @example
 * // For questions without media (JSON)
 * await createQuestion('wordbox', {
 *   challengeId: 'uuid',
 *   stage: 'VOCABULARY',
 *   phase: 'phase_1',
 *   points: 15,
 *   content: [['C', 'A', 'T'], ['R', 'O', 'D'], ['E', 'A', 'T']]
 * });
 */
export default async function createQuestion(
  type: QuestionType,
  data: FormData | Record<string, unknown>
): Promise<QuestionResponseDto> {
  try {
    const endpoint = QUESTION_TYPE_ENDPOINTS[type];

    if (!endpoint) {
      throw new Error(`Unknown question type: ${type}`);
    }

    const isFormData = data instanceof FormData;

    const response = await api.post<QuestionResponseDto>(endpoint, data, {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(`Error creating ${type} question:`, error.message);
      console.error('Error details:', error.response?.data);
      throw error;
    } else {
      console.error(`Unexpected error creating ${type} question:`, error);
      throw new Error(`Error creating ${type} question`);
    }
  }
}
