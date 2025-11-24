import { QuestionsService } from '../services/questions.service';
import * as QuestionDtos from '../dto';
export declare class QuestionsCreationController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    createImageToMultipleChoices(dto: QuestionDtos.CreateImageToMultipleChoicesDto): Promise<import("../services").FormattedQuestion | null>;
    createWordbox(dto: QuestionDtos.CreateWordboxDto): Promise<import("../services").FormattedQuestion | null>;
    createSpelling(dto: QuestionDtos.CreateSpellingDto): Promise<import("../services").FormattedQuestion | null>;
    createWordAssociations(dto: QuestionDtos.CreateWordAssociationsDto): Promise<import("../services").FormattedQuestion | null>;
    createUnscramble(dto: QuestionDtos.CreateUnscrambleDto): Promise<import("../services").FormattedQuestion | null>;
    createTenses(dto: QuestionDtos.CreateTensesDto): Promise<import("../services").FormattedQuestion | null>;
    createTagIt(dto: QuestionDtos.CreateTagItDto): Promise<import("../services").FormattedQuestion | null>;
    createReportIt(dto: QuestionDtos.CreateReportItDto): Promise<import("../services").FormattedQuestion | null>;
    createReadIt(dto: QuestionDtos.CreateReadItDto): Promise<import("../services").FormattedQuestion | null>;
    createWordMatch(dto: QuestionDtos.CreateWordMatchDto): Promise<import("../services").FormattedQuestion | null>;
    createGossip(dto: QuestionDtos.CreateGossipDto): Promise<import("../services").FormattedQuestion | null>;
    createTopicBasedAudio(dto: QuestionDtos.CreateTopicBasedAudioDto): Promise<import("../services").FormattedQuestion | null>;
    createLyricsTraining(dto: QuestionDtos.CreateLyricsTrainingDto): Promise<import("../services").FormattedQuestion | null>;
    createSentenceMaker(dto: QuestionDtos.CreateSentenceMakerDto): Promise<import("../services").FormattedQuestion | null>;
    createFastTest(dto: QuestionDtos.CreateFastTestDto): Promise<import("../services").FormattedQuestion | null>;
    createTales(dto: QuestionDtos.CreateTalesDto): Promise<import("../services").FormattedQuestion | null>;
    createSuperbrain(dto: QuestionDtos.CreateSuperbrainDto): Promise<import("../services").FormattedQuestion | null>;
    createTellMeAboutIt(dto: QuestionDtos.CreateTellMeAboutItDto): Promise<import("../services").FormattedQuestion | null>;
    createDebate(dto: QuestionDtos.CreateDebateDto): Promise<import("../services").FormattedQuestion | null>;
}
