import { QuestionsService } from '../services/questions.service';
import { QuestionStage } from '@prisma/client';
export declare class QuestionsQueryController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    findAll(challengeId?: string, stage?: QuestionStage, phase?: string): Promise<import("../services").FormattedQuestion[]>;
    getSchoolStats(schoolId: string, questionId?: string): Promise<unknown>;
    findOne(id: string): Promise<import("../services").FormattedQuestion | null>;
}
