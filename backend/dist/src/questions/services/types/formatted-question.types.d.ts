import { QuestionStage, ValidationMethod, Question, QuestionMedia, QuestionConfiguration, MediaFile as PrismaMediaFile } from '@prisma/client';
export interface MediaFile {
    id: string;
    url: string;
    type: string;
    filename: string;
    mimeType: string;
    size: number;
    position: number;
    context: string | null;
}
export interface QuestionConfigurations {
    [key: string]: string;
}
export interface BaseQuestionFields {
    id: string;
    type: string;
    stage: QuestionStage;
    position: number;
    points: number;
    timeLimit: number;
    maxAttempts: number;
    text: string;
    instructions: string;
    validationMethod: ValidationMethod;
    configurations?: QuestionConfigurations;
    createdAt: Date;
    updatedAt: Date;
}
export type QuestionWithRelations = Question & {
    questionMedia?: (QuestionMedia & {
        mediaFile: PrismaMediaFile;
    })[];
    configurations?: QuestionConfiguration[];
    subQuestions?: QuestionWithRelations[];
    challenge?: any;
    parentQuestion?: any;
};
export interface EnrichedQuestion extends BaseQuestionFields {
    content?: any;
    options?: any;
    answer?: any;
    media: MediaFile[];
    subQuestions?: EnrichedQuestion[];
    challenge?: any;
    parentQuestion?: any;
}
export interface FormattedImageToMultipleChoicesQuestion extends Omit<BaseQuestionFields, 'configurations'> {
    image: string | null;
    options: string[];
    answer: string;
}
export interface FormattedSpellingQuestion extends Omit<BaseQuestionFields, 'configurations'> {
    image: string | null;
    answer: string;
}
export interface FormattedWordMatchQuestion extends BaseQuestionFields {
    audio: string | null;
    options: string[];
    answer: string;
}
export interface FormattedWordboxQuestion extends Omit<BaseQuestionFields, 'configurations'> {
    grid: string[][];
    gridWidth?: string;
    gridHeight?: string;
    maxWords?: string;
    [key: string]: any;
}
export interface FormattedWordAssociationsQuestion extends BaseQuestionFields {
    centralWord: string;
    image: string | null;
    maxAssociations: number;
}
export interface FormattedUnscrambleQuestion extends BaseQuestionFields {
    scrambledWords: string[];
    correctSentence: string;
    image: string | null;
}
export interface FormattedFillInTheBlankQuestion extends BaseQuestionFields {
    sentence: string;
    options: string[] | null;
    answer: string | string[];
}
export interface FormattedVerbConjugationQuestion extends BaseQuestionFields {
    verb: string;
    context: string;
    tense: string;
    subject: string;
    answer: string;
}
export interface FormattedGossipQuestion extends Omit<BaseQuestionFields, 'configurations'> {
    audio: string | null;
    answer: string;
}
export interface FormattedTopicBasedAudioQuestion extends BaseQuestionFields {
    audio: string | null;
    subQuestions: FormattedQuestion[];
}
export interface FormattedTopicBasedAudioSubquestion extends BaseQuestionFields {
    content: string;
    options: string[];
    answer: string;
    parentQuestionId?: string;
}
export interface FormattedLyricsTrainingQuestion extends BaseQuestionFields {
    video: string | null;
    options: string[];
    answer: string;
}
export interface FormattedSentenceMakerQuestion extends BaseQuestionFields {
    images: string[];
}
export interface FormattedTalesQuestion extends BaseQuestionFields {
    image: string | null;
}
export interface FormattedTagItQuestion extends BaseQuestionFields {
    content: string[];
    answer: string[];
    image: string | null;
}
export interface FormattedReadItQuestion extends BaseQuestionFields {
    content: string;
    image: string | null;
    subQuestions: FormattedQuestion[];
}
export interface FormattedReadItSubquestion extends BaseQuestionFields {
    content: string;
    options: boolean[];
    answer: boolean;
    parentQuestionId?: string;
}
export interface FormattedTellMeAboutItQuestion extends BaseQuestionFields {
    image: string | null;
    video: string | null;
    prompt: string;
    minDuration: number;
}
export interface FormattedReportItQuestion extends BaseQuestionFields {
    content: string;
    image: string | null;
}
export interface FormattedDebateQuestion extends BaseQuestionFields {
    topic: string;
    minDuration: number;
    stance: string;
}
export interface FormattedFastTestQuestion extends BaseQuestionFields {
    content: string[];
    options: string[];
    answer: string;
}
export interface FormattedSuperbrainQuestion extends BaseQuestionFields {
    content: string;
    image: string | null;
}
export interface FormattedTensesQuestion extends BaseQuestionFields {
    content: string;
    options: string[];
    answer: string;
    image: string | null;
}
export interface FormattedDefaultQuestion extends BaseQuestionFields {
    content?: any;
    options?: any;
    answer?: any;
    image?: string | null;
    audio?: string | null;
    video?: string | null;
    images?: string[];
    audios?: string[];
    subQuestions: FormattedQuestion[];
}
export type FormattedQuestion = FormattedImageToMultipleChoicesQuestion | FormattedSpellingQuestion | FormattedWordMatchQuestion | FormattedWordboxQuestion | FormattedWordAssociationsQuestion | FormattedUnscrambleQuestion | FormattedFillInTheBlankQuestion | FormattedVerbConjugationQuestion | FormattedGossipQuestion | FormattedTopicBasedAudioQuestion | FormattedTopicBasedAudioSubquestion | FormattedLyricsTrainingQuestion | FormattedSentenceMakerQuestion | FormattedTalesQuestion | FormattedTagItQuestion | FormattedReadItQuestion | FormattedTellMeAboutItQuestion | FormattedReportItQuestion | FormattedDebateQuestion | FormattedFastTestQuestion | FormattedSuperbrainQuestion | FormattedTensesQuestion | FormattedDefaultQuestion;
