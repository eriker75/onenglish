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
    phase: string;
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
export interface FormattedImageToMultipleChoicesQuestion extends BaseQuestionFields {
    images: MediaFile[];
    options: string[];
    answer: string;
}
export interface FormattedSpellingQuestion extends Omit<BaseQuestionFields, 'configurations'> {
    image: MediaFile | null;
    answer: string;
}
export interface FormattedWordMatchQuestion extends BaseQuestionFields {
    images: MediaFile[];
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
    totalAssociations: number;
}
export interface FormattedUnscrambleQuestion extends BaseQuestionFields {
    scrambledWords: string[];
    correctSentence: string;
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
export interface FormattedGossipQuestion extends BaseQuestionFields {
    audio: MediaFile | null;
    subQuestions: FormattedQuestion[];
}
export interface FormattedTopicBasedAudioQuestion extends BaseQuestionFields {
    audio: MediaFile | null;
    subQuestions: FormattedQuestion[];
}
export interface FormattedTopicBasedAudioSubquestion extends BaseQuestionFields {
    content: string;
    options: string[];
    answer: string;
    parentQuestionId?: string;
}
export interface FormattedLyricsTrainingQuestion extends BaseQuestionFields {
    media: MediaFile | null;
    options: string[];
    answer: string;
}
export interface FormattedSentenceMakerQuestion extends BaseQuestionFields {
    images: MediaFile[];
}
export interface FormattedTalesQuestion extends BaseQuestionFields {
    images: MediaFile[];
}
export interface FormattedTagItQuestion extends BaseQuestionFields {
    content: string[];
    answer: string[];
    image: MediaFile | null;
}
export interface FormattedReadItQuestion extends BaseQuestionFields {
    textToRead: string;
    referenceAudio: MediaFile | null;
}
export interface FormattedTellMeAboutItQuestion extends BaseQuestionFields {
    image: MediaFile | null;
    video: MediaFile | null;
    prompt: string;
    minDuration: number;
}
export interface FormattedReportItQuestion extends BaseQuestionFields {
    content: string;
    image: MediaFile | null;
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
    image: MediaFile | null;
}
export interface FormattedTensesQuestion extends BaseQuestionFields {
    subQuestions: FormattedQuestion[];
    totalQuestions: number;
}
export interface FormattedDefaultQuestion extends BaseQuestionFields {
    content?: any;
    options?: any;
    answer?: any;
    media: MediaFile[];
    subQuestions: FormattedQuestion[];
}
export type FormattedQuestion = FormattedImageToMultipleChoicesQuestion | FormattedSpellingQuestion | FormattedWordMatchQuestion | FormattedWordboxQuestion | FormattedWordAssociationsQuestion | FormattedUnscrambleQuestion | FormattedFillInTheBlankQuestion | FormattedVerbConjugationQuestion | FormattedGossipQuestion | FormattedTopicBasedAudioQuestion | FormattedTopicBasedAudioSubquestion | FormattedLyricsTrainingQuestion | FormattedSentenceMakerQuestion | FormattedTalesQuestion | FormattedTagItQuestion | FormattedReadItQuestion | FormattedTellMeAboutItQuestion | FormattedReportItQuestion | FormattedDebateQuestion | FormattedFastTestQuestion | FormattedSuperbrainQuestion | FormattedTensesQuestion | FormattedDefaultQuestion;
