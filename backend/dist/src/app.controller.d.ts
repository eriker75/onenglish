import { AppService } from './app.service';
import { AiTestRequestDto, AiTestResponseDto } from './common/dtos/ai.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    testAiQuery(request: AiTestRequestDto): Promise<AiTestResponseDto>;
}
