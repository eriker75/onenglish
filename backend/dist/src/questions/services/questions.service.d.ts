import { PrismaService } from '../../database/prisma.service';
import { QuestionStage } from '@prisma/client';
import { QuestionMediaService, QuestionFormatterService } from '.';
import * as QuestionDtos from '../dto';
export declare class QuestionsService {
    private readonly prisma;
    private readonly questionMediaService;
    private readonly questionFormatterService;
    private readonly logger;
    constructor(prisma: PrismaService, questionMediaService: QuestionMediaService, questionFormatterService: QuestionFormatterService);
    private calculateNextPosition;
    private attachConfigurations;
    private validateWordboxGrid;
    createImageToMultipleChoices(dto: QuestionDtos.CreateImageToMultipleChoicesDto): Promise<import(".").FormattedQuestion | null>;
    createWordbox(dto: QuestionDtos.CreateWordboxDto): Promise<import(".").FormattedQuestion | null>;
    createSpelling(dto: QuestionDtos.CreateSpellingDto): Promise<import(".").FormattedQuestion | null>;
    createWordAssociations(dto: QuestionDtos.CreateWordAssociationsDto): Promise<import(".").FormattedQuestion | null>;
    createUnscramble(dto: QuestionDtos.CreateUnscrambleDto): Promise<import(".").FormattedQuestion | null>;
    createTenses(dto: QuestionDtos.CreateTensesDto): Promise<import(".").FormattedQuestion | null>;
    createTagIt(dto: QuestionDtos.CreateTagItDto): Promise<import(".").FormattedQuestion | null>;
    createReportIt(dto: QuestionDtos.CreateReportItDto): Promise<import(".").FormattedQuestion | null>;
    createReadIt(dto: QuestionDtos.CreateReadItDto): Promise<import(".").FormattedQuestion | null>;
    createWordMatch(dto: QuestionDtos.CreateWordMatchDto): Promise<import(".").FormattedQuestion | null>;
    createGossip(dto: QuestionDtos.CreateGossipDto): Promise<import(".").FormattedQuestion | null>;
    createTopicBasedAudio(dto: QuestionDtos.CreateTopicBasedAudioDto): Promise<import(".").FormattedQuestion | null>;
    private recalculateParentPoints;
    createLyricsTraining(dto: QuestionDtos.CreateLyricsTrainingDto): Promise<import(".").FormattedQuestion | null>;
    createSentenceMaker(dto: QuestionDtos.CreateSentenceMakerDto): Promise<import(".").FormattedQuestion | null>;
    createFastTest(dto: QuestionDtos.CreateFastTestDto): Promise<import(".").FormattedQuestion | null>;
    createTales(dto: QuestionDtos.CreateTalesDto): Promise<import(".").FormattedQuestion | null>;
    createSuperbrain(dto: QuestionDtos.CreateSuperbrainDto): Promise<import(".").FormattedQuestion | null>;
    createTellMeAboutIt(dto: QuestionDtos.CreateTellMeAboutItDto): Promise<import(".").FormattedQuestion | null>;
    createDebate(dto: QuestionDtos.CreateDebateDto): Promise<import(".").FormattedQuestion | null>;
    findAll(filters?: {
        challengeId?: string;
        stage?: QuestionStage;
    }): Promise<import(".").FormattedQuestion[]>;
    findByChallengeId(challengeId: string, filters?: {
        stage?: QuestionStage;
        type?: string;
    }): Promise<import(".").FormattedQuestion[]>;
    findOne(id: string): Promise<import(".").FormattedQuestion | null>;
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
