import { QuestionUpdateService } from '../services/question-update.service';
import { UpdateImageToMultipleChoicesDto, UpdateWordboxDto, UpdateSpellingDto, UpdateWordAssociationsDto, UpdateUnscrambleDto, UpdateTensesDto, UpdateTagItDto, UpdateReportItDto, UpdateReadItDto, UpdateWordMatchDto, UpdateGossipDto, UpdateTopicBasedAudioDto, UpdateTopicBasedAudioSubquestionDto, UpdateLyricsTrainingDto, UpdateSentenceMakerDto, UpdateFastTestDto, UpdateTalesDto, UpdateSuperbrainDto, UpdateTellMeAboutItDto, UpdateDebateDto, BulkUpdateQuestionsDto } from '../dto/update';
export declare class QuestionsUpdateController {
    private readonly updateService;
    constructor(updateService: QuestionUpdateService);
    updateImageToMultipleChoices(id: string, dto: UpdateImageToMultipleChoicesDto): Promise<any>;
    updateWordbox(id: string, dto: UpdateWordboxDto): Promise<any>;
    updateSpelling(id: string, dto: UpdateSpellingDto): Promise<any>;
    updateWordAssociations(id: string, dto: UpdateWordAssociationsDto): Promise<any>;
    updateUnscramble(id: string, dto: UpdateUnscrambleDto): Promise<any>;
    updateTenses(id: string, dto: UpdateTensesDto): Promise<any>;
    updateTagIt(id: string, dto: UpdateTagItDto): Promise<any>;
    updateReportIt(id: string, dto: UpdateReportItDto): Promise<any>;
    updateReadIt(id: string, dto: UpdateReadItDto): Promise<any>;
    updateWordMatch(id: string, dto: UpdateWordMatchDto): Promise<any>;
    updateGossip(id: string, dto: UpdateGossipDto): Promise<any>;
    updateTopicBasedAudio(id: string, dto: UpdateTopicBasedAudioDto): Promise<any>;
    updateTopicBasedAudioSubquestion(id: string, dto: UpdateTopicBasedAudioSubquestionDto): Promise<any>;
    updateLyricsTraining(id: string, dto: UpdateLyricsTrainingDto): Promise<any>;
    updateSentenceMaker(id: string, dto: UpdateSentenceMakerDto): Promise<any>;
    updateFastTest(id: string, dto: UpdateFastTestDto): Promise<any>;
    updateTales(id: string, dto: UpdateTalesDto): Promise<any>;
    updateSuperbrain(id: string, dto: UpdateSuperbrainDto): Promise<any>;
    updateTellMeAboutIt(id: string, dto: UpdateTellMeAboutItDto): Promise<any>;
    updateDebate(id: string, dto: UpdateDebateDto): Promise<any>;
    bulkUpdateQuestions(dto: BulkUpdateQuestionsDto): Promise<any[]>;
    deleteQuestion(id: string): Promise<{
        message: string;
    }>;
}
