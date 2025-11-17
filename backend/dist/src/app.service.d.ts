import { AiService } from './ai/ai.service';
import { AiTestRequestDto, AiTestResponseDto } from './common/dtos/ai.dto';
export declare class AppService {
    private readonly aiService;
    constructor(aiService: AiService);
    getHello(): string;
    testAiQuery({ prompt }: AiTestRequestDto): Promise<AiTestResponseDto>;
}
