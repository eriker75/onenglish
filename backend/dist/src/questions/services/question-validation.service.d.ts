import { PrismaService } from '../../database/prisma.service';
import { AiFilesService } from '../../ai-files/ai-files.service';
import { AiService } from '../../ai/ai.service';
export interface ValidationResult {
    isCorrect: boolean;
    pointsEarned: number;
    feedbackEnglish?: string;
    feedbackSpanish?: string;
    details?: any;
}
export declare class QuestionValidationService {
    private readonly prisma;
    private readonly aiFilesService;
    private readonly aiService;
    constructor(prisma: PrismaService, aiFilesService: AiFilesService, aiService: AiService);
    private parseAIResponse;
    validateAnswer(questionId: string, userAnswer: any, audioFile?: any): Promise<ValidationResult>;
    private validateMultipleChoice;
    private validateUnscramble;
    private validateTenses;
    private validateTagIt;
    private validateReadIt;
    private validateWordMatch;
    private validateTopicBasedAudio;
    private validateLyricsTraining;
    private validateFastTest;
    private validateWordbox;
    private validateSpelling;
    private validateWordAssociations;
    private validateReportIt;
    private validateGossip;
    private validateSentenceMaker;
    private validateTales;
    private validateSuperbrain;
    private validateTellMeAboutIt;
    private validateDebate;
}
