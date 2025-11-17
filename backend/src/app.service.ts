import { Inject, Injectable } from '@nestjs/common';
import { AiService } from './ai/ai.service';
import { AiTestRequestDto, AiTestResponseDto } from './common/dtos/ai.dto';

@Injectable()
export class AppService {
  constructor(@Inject('GEMINI_AI') private readonly aiService: AiService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testAiQuery({ prompt }: AiTestRequestDto): Promise<AiTestResponseDto> {
    const response = await this.aiService.invokeText(prompt);
    return {
      prompt,
      response,
    };
  }
}
