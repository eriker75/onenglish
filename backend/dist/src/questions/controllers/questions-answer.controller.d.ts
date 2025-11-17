import { PrismaService } from '../../database/prisma.service';
import { QuestionValidationService } from '../services/question-validation.service';
import { AnswerImageToMultipleChoicesDto, AnswerWordboxDto, AnswerAudioQuestionDto, AnswerWordAssociationsDto, AnswerUnscrambleDto, AnswerTensesDto, AnswerTagItDto, AnswerReportItDto, AnswerReadItDto, AnswerWordMatchDto, AnswerTopicBasedAudioDto, AnswerLyricsTrainingDto, AnswerSentenceMakerDto, AnswerFastTestDto, AnswerTalesDto, AnswerDebateDto } from '../dto/answer';
interface ValidationResponseDto {
    success: boolean;
    isCorrect: boolean;
    pointsEarned: number;
    feedbackEnglish?: string;
    feedbackSpanish?: string;
    details?: any;
    studentAnswer: {
        id: string;
        questionId: string;
        studentId: string;
        isCorrect: boolean;
        pointsEarned: number;
        attemptNumber: number;
        timeSpent: number;
    };
}
export declare class QuestionsAnswerController {
    private readonly prisma;
    private readonly validationService;
    constructor(prisma: PrismaService, validationService: QuestionValidationService);
    private processAnswer;
    answerImageToMultipleChoices(id: string, dto: AnswerImageToMultipleChoicesDto, userId: string): Promise<ValidationResponseDto>;
    answerWordbox(id: string, dto: AnswerWordboxDto, userId: string): Promise<ValidationResponseDto>;
    answerSpelling(id: string, dto: AnswerAudioQuestionDto, userId: string): Promise<ValidationResponseDto>;
    answerWordAssociations(id: string, dto: AnswerWordAssociationsDto, userId: string): Promise<ValidationResponseDto>;
    answerUnscramble(id: string, dto: AnswerUnscrambleDto, userId: string): Promise<ValidationResponseDto>;
    answerTenses(id: string, dto: AnswerTensesDto, userId: string): Promise<ValidationResponseDto>;
    answerTagIt(id: string, dto: AnswerTagItDto, userId: string): Promise<ValidationResponseDto>;
    answerReportIt(id: string, dto: AnswerReportItDto, userId: string): Promise<ValidationResponseDto>;
    answerReadIt(id: string, dto: AnswerReadItDto, userId: string): Promise<ValidationResponseDto>;
    answerWordMatch(id: string, dto: AnswerWordMatchDto, userId: string): Promise<ValidationResponseDto>;
    answerGossip(id: string, dto: AnswerAudioQuestionDto, userId: string): Promise<ValidationResponseDto>;
    answerTopicBasedAudio(id: string, dto: AnswerTopicBasedAudioDto, userId: string): Promise<ValidationResponseDto>;
    answerLyricsTraining(id: string, dto: AnswerLyricsTrainingDto, userId: string): Promise<ValidationResponseDto>;
    answerSentenceMaker(id: string, dto: AnswerSentenceMakerDto, userId: string): Promise<ValidationResponseDto>;
    answerFastTest(id: string, dto: AnswerFastTestDto, userId: string): Promise<ValidationResponseDto>;
    answerTales(id: string, dto: AnswerTalesDto, userId: string): Promise<ValidationResponseDto>;
    answerSuperbrain(id: string, dto: AnswerAudioQuestionDto, userId: string): Promise<ValidationResponseDto>;
    answerTellMeAboutIt(id: string, dto: AnswerAudioQuestionDto, userId: string): Promise<ValidationResponseDto>;
    answerDebate(id: string, dto: AnswerDebateDto, userId: string): Promise<ValidationResponseDto>;
}
export {};
