import { PrismaService } from '../../database/prisma.service';
import { QuestionMediaService } from './question-media.service';
import { QuestionFormatterService } from './question-formatter.service';
export declare class QuestionUpdateService {
    private readonly prisma;
    private readonly questionMediaService;
    private readonly questionFormatterService;
    constructor(prisma: PrismaService, questionMediaService: QuestionMediaService, questionFormatterService: QuestionFormatterService);
    private validateWordboxGrid;
    updateQuestion(questionId: string, updateData: any): Promise<any>;
    recalculateParentPoints(parentQuestionId: string): Promise<void>;
    calculatePointsFromSubQuestions(subQuestions: any[]): number;
    updateTopicBasedAudioSubquestion(id: string, updateData: any): Promise<any>;
    updateQuestionText(questionId: string, text: string): Promise<any>;
    updateQuestionInstructions(questionId: string, instructions: string): Promise<any>;
    updateQuestionTimeLimit(questionId: string, timeLimit: number): Promise<any>;
    updateQuestionMaxAttempts(questionId: string, maxAttempts: number): Promise<any>;
    updateQuestionPoints(questionId: string, points: number): Promise<any>;
    updateQuestionContent(questionId: string, content: any): Promise<any>;
    updateQuestionOptions(questionId: string, options: any): Promise<any>;
    updateQuestionAnswer(questionId: string, answer: any): Promise<any>;
    updateQuestionPosition(questionId: string, position: number): Promise<any>;
    bulkUpdateQuestions(updates: {
        questionId: string;
        data: any;
    }[]): Promise<any[]>;
    deleteQuestion(questionId: string): Promise<void>;
}
