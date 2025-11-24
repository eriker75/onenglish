import { PrismaService } from '../../database/prisma.service';
import { QuestionStage } from '@prisma/client';
import { QuestionMediaService, QuestionFormatterService } from '.';
import * as QuestionDtos from '../dto';
import { FormattedQuestion } from './types';
export declare class QuestionsService {
    private readonly prisma;
    private readonly questionMediaService;
    private readonly questionFormatterService;
    private readonly logger;
    constructor(prisma: PrismaService, questionMediaService: QuestionMediaService, questionFormatterService: QuestionFormatterService);
    private calculateNextPosition;
    private attachConfigurations;
    private validateWordboxGrid;
    createImageToMultipleChoices(dto: QuestionDtos.CreateImageToMultipleChoicesDto): Promise<FormattedQuestion | null>;
    createWordbox(dto: QuestionDtos.CreateWordboxDto): Promise<FormattedQuestion | null>;
    createSpelling(dto: QuestionDtos.CreateSpellingDto): Promise<FormattedQuestion | null>;
    createWordAssociations(dto: QuestionDtos.CreateWordAssociationsDto): Promise<FormattedQuestion | null>;
    createUnscramble(dto: QuestionDtos.CreateUnscrambleDto): Promise<FormattedQuestion | null>;
    createTenses(dto: QuestionDtos.CreateTensesDto): Promise<FormattedQuestion | null>;
    createTagIt(dto: QuestionDtos.CreateTagItDto): Promise<FormattedQuestion | null>;
    createReportIt(dto: QuestionDtos.CreateReportItDto): Promise<FormattedQuestion | null>;
    createReadIt(dto: QuestionDtos.CreateReadItDto): Promise<FormattedQuestion | null>;
    createWordMatch(dto: QuestionDtos.CreateWordMatchDto): Promise<FormattedQuestion | null>;
    createGossip(dto: QuestionDtos.CreateGossipDto): Promise<FormattedQuestion | null>;
    createTopicBasedAudio(dto: QuestionDtos.CreateTopicBasedAudioDto): Promise<FormattedQuestion | null>;
    private recalculateParentPoints;
    createLyricsTraining(dto: QuestionDtos.CreateLyricsTrainingDto): Promise<FormattedQuestion | null>;
    createSentenceMaker(dto: QuestionDtos.CreateSentenceMakerDto): Promise<FormattedQuestion | null>;
    createFastTest(dto: QuestionDtos.CreateFastTestDto): Promise<FormattedQuestion | null>;
    createTales(dto: QuestionDtos.CreateTalesDto): Promise<FormattedQuestion | null>;
    createSuperbrain(dto: QuestionDtos.CreateSuperbrainDto): Promise<FormattedQuestion | null>;
    createTellMeAboutIt(dto: QuestionDtos.CreateTellMeAboutItDto): Promise<FormattedQuestion | null>;
    createDebate(dto: QuestionDtos.CreateDebateDto): Promise<FormattedQuestion | null>;
    findAll(filters?: {
        challengeId?: string;
        stage?: QuestionStage;
    }): Promise<FormattedQuestion[]>;
    findByChallengeId(challengeId: string, filters?: {
        stage?: QuestionStage;
        type?: string;
    }): Promise<FormattedQuestion[] | Record<string, FormattedQuestion[]> | Record<string, Record<string, FormattedQuestion[]>>>;
    findOne(id: string): Promise<FormattedQuestion | null>;
    getSchoolStats(schoolId: string, questionId?: string): Promise<{
        questionId: string;
        questionText: string;
        questionType: string;
        totalAttempts: number;
        correctAnswers: number;
        averageTime: number;
        successRate: number;
    }[]>;
    private validateChallenge;
}
