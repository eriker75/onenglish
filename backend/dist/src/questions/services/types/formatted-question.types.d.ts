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
    image: MediaFile | null;
    options: string[];
    answer: string;
}
export interface FormattedSpellingQuestion extends BaseQuestionFields {
    image: MediaFile | null;
    audio: MediaFile | null;
    answer: string;
}
export interface FormattedWordMatchQuestion extends BaseQuestionFields {
    images: MediaFile[];
    options: string[];
    answer: string;
}
export interface FormattedWordboxQuestion extends BaseQuestionFields {
    grid: string[][];
    words: string[];
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
export interface FormattedLyricsTrainingQuestion extends BaseQuestionFields {
    audio: MediaFile | null;
    subQuestions: FormattedQuestion[];
}
export interface FormattedSentenceMakerQuestion extends BaseQuestionFields {
    image: MediaFile | null;
    prompt: string;
    hints: string | null;
}
export interface FormattedTalesQuestion extends BaseQuestionFields {
    images: MediaFile[];
    prompt: string;
    minWords: number;
}
export interface FormattedTagItQuestion extends BaseQuestionFields {
    sentence: string;
    tagsToIdentify: string[];
    answer: any;
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
    topic: string;
    media: MediaFile[];
    minDuration: number;
}
export interface FormattedDebateQuestion extends BaseQuestionFields {
    topic: string;
    minDuration: number;
    stance: string;
}
export interface FormattedFastTestQuestion extends BaseQuestionFields {
    subQuestions: FormattedQuestion[];
    totalQuestions: number;
}
export interface FormattedSuperbrainQuestion extends BaseQuestionFields {
    subQuestions: FormattedQuestion[];
    totalQuestions: number;
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
export type FormattedQuestion = FormattedImageToMultipleChoicesQuestion | FormattedSpellingQuestion | FormattedWordMatchQuestion | FormattedWordboxQuestion | FormattedWordAssociationsQuestion | FormattedUnscrambleQuestion | FormattedFillInTheBlankQuestion | FormattedVerbConjugationQuestion | FormattedGossipQuestion | FormattedTopicBasedAudioQuestion | FormattedLyricsTrainingQuestion | FormattedSentenceMakerQuestion | FormattedTalesQuestion | FormattedTagItQuestion | FormattedReadItQuestion | FormattedTellMeAboutItQuestion | FormattedReportItQuestion | FormattedDebateQuestion | FormattedFastTestQuestion | FormattedSuperbrainQuestion | FormattedTensesQuestion | FormattedDefaultQuestion;
