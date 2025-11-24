"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFormatterService = void 0;
const common_1 = require("@nestjs/common");
const file_service_1 = require("../../files/services/file.service");
let QuestionFormatterService = class QuestionFormatterService {
    fileService;
    constructor(fileService) {
        this.fileService = fileService;
    }
    getConfigurationsIfNotEmpty(configurations) {
        if (!configurations || Object.keys(configurations).length === 0) {
            return undefined;
        }
        return configurations;
    }
    getMediaUrl(media, type) {
        if (!media || media.length === 0)
            return null;
        const file = media.find((m) => m.type === type);
        if (!file?.url)
            return null;
        return this.fileService.getFullUrl(file.url);
    }
    getMediaUrls(media, type) {
        if (!media || media.length === 0)
            return [];
        const filteredMedia = media.filter((m) => m.type === type);
        return filteredMedia
            .map((m) => ({
            url: this.fileService.getFullUrl(m.url),
            position: m.position || 0,
        }))
            .filter((item) => item.url !== null)
            .sort((a, b) => a.position - b.position)
            .map((item) => item.url);
    }
    removeNullFields(obj) {
        if (obj === null || obj === undefined) {
            return undefined;
        }
        if (Array.isArray(obj)) {
            const cleaned = obj.map((item) => this.removeNullFields(item)).filter((item) => item !== undefined);
            return cleaned.length > 0 ? cleaned : undefined;
        }
        if (typeof obj === 'object' && obj.constructor === Object) {
            const cleaned = {};
            let hasAnyValue = false;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = this.removeNullFields(obj[key]);
                    if (value !== null && value !== undefined) {
                        cleaned[key] = value;
                        hasAnyValue = true;
                    }
                }
            }
            return hasAnyValue ? cleaned : undefined;
        }
        return obj;
    }
    formatQuestion(question) {
        if (!question)
            return null;
        const formatted = this.formatQuestionInternal(question);
        return formatted ? this.removeNullFields(formatted) : null;
    }
    formatQuestionInternal(question) {
        if (!question)
            return null;
        const formatterMap = {
            image_to_multiple_choices: this.formatImageToMultipleChoices.bind(this),
            spelling: this.formatSpelling.bind(this),
            word_match: this.formatWordMatch.bind(this),
            wordbox: this.formatWordbox.bind(this),
            word_associations: this.formatWordAssociations.bind(this),
            unscramble: this.formatUnscramble.bind(this),
            fill_in_the_blank: this.formatFillInTheBlank.bind(this),
            verb_conjugation: this.formatVerbConjugation.bind(this),
            gossip: this.formatGossip.bind(this),
            topic_based_audio: this.formatTopicBasedAudio.bind(this),
            topic_based_audio_subquestion: this.formatTopicBasedAudioSubquestion.bind(this),
            lyrics_training: this.formatLyricsTraining.bind(this),
            sentence_maker: this.formatSentenceMaker.bind(this),
            tales: this.formatTales.bind(this),
            tag_it: this.formatTagIt.bind(this),
            read_it: this.formatReadIt.bind(this),
            read_it_subquestion: this.formatReadItSubquestion.bind(this),
            tell_me_about_it: this.formatTellMeAboutIt.bind(this),
            report_it: this.formatReportIt.bind(this),
            debate: this.formatDebate.bind(this),
            fast_test: this.formatFastTest.bind(this),
            superbrain: this.formatSuperbrain.bind(this),
            tenses: this.formatTenses.bind(this),
        };
        const formatter = formatterMap[question.type];
        if (formatter) {
            return formatter(question);
        }
        return this.formatDefault(question);
    }
    formatQuestions(questions) {
        return questions
            .map((q) => this.formatQuestion(q))
            .filter(Boolean);
    }
    formatImageToMultipleChoices(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            image: this.getMediaUrl(question.media, 'image'),
            options: question.options || [],
            answer: question.answer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatSpelling(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            image: this.getMediaUrl(question.media, 'image'),
            answer: question.answer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatWordMatch(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            audio: this.getMediaUrl(question.media, 'audio') || this.getMediaUrl(question.media, 'video'),
            options: question.options || [],
            answer: question.answer,
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatWordbox(question) {
        const configurations = question.configurations || {};
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            grid: question.content || [],
            ...configurations,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatWordAssociations(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            centralWord: question.content,
            image: this.getMediaUrl(question.media, 'image'),
            maxAssociations: parseInt(question.configurations?.maxAssociations || '10'),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatUnscramble(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            scrambledWords: question.content || [],
            correctSentence: question.answer,
            image: this.getMediaUrl(question.media, 'image'),
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatFillInTheBlank(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            sentence: question.content,
            options: question.options || null,
            answer: question.answer,
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatVerbConjugation(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            verb: question.content?.verb,
            context: question.content?.context,
            tense: question.content?.tense,
            subject: question.content?.subject,
            answer: question.answer,
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatGossip(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            audio: this.getMediaUrl(question.media, 'audio'),
            answer: question.answer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatTopicBasedAudio(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            audio: this.getMediaUrl(question.media, 'audio'),
            subQuestions: question.subQuestions
                ?.map((sq) => this.formatQuestion(sq))
                .filter((q) => q !== null) || [],
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatTopicBasedAudioSubquestion(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content || '',
            options: question.options || [],
            answer: question.answer,
            parentQuestionId: question.parentQuestion?.id,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatLyricsTraining(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            video: this.getMediaUrl(question.media, 'video'),
            options: question.options || [],
            answer: question.answer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatSentenceMaker(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            images: this.getMediaUrls(question.media, 'image'),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatTales(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            image: this.getMediaUrl(question.media, 'image'),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatTagIt(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content,
            answer: question.answer,
            image: this.getMediaUrl(question.media, 'image'),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatReadIt(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content,
            image: this.getMediaUrl(question.media, 'image'),
            subQuestions: question.subQuestions
                ?.map((sq) => this.formatQuestion(sq))
                .filter((q) => q !== null) || [],
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatReadItSubquestion(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content || '',
            options: question.options || [],
            answer: question.answer,
            parentQuestionId: question.parentQuestion?.id,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatTellMeAboutIt(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            image: this.getMediaUrl(question.media, 'image'),
            video: this.getMediaUrl(question.media, 'video'),
            prompt: question.content,
            minDuration: parseInt(question.configurations?.minDuration || '30'),
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatReportIt(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content,
            image: this.getMediaUrl(question.media, 'image'),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatDebate(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            topic: question.content,
            minDuration: parseInt(question.configurations?.minDuration || '90'),
            stance: question.answer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatFastTest(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content || [],
            options: question.options || [],
            answer: question.answer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatSuperbrain(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content,
            image: this.getMediaUrl(question.media, 'image'),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatTenses(question) {
        return {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content || '',
            options: question.options || [],
            answer: question.answer,
            image: this.getMediaUrl(question.media, 'image'),
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatDefault(question) {
        const result = {
            id: question.id,
            type: question.type,
            stage: question.stage,
            position: question.position,
            points: question.points,
            timeLimit: question.timeLimit,
            maxAttempts: question.maxAttempts,
            text: question.text,
            instructions: question.instructions,
            validationMethod: question.validationMethod,
            content: question.content,
            options: question.options,
            answer: question.answer,
            subQuestions: question.subQuestions
                ?.map((sq) => this.formatQuestion(sq))
                .filter((q) => q !== null) || [],
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
        const imageUrl = this.getMediaUrl(question.media, 'image');
        const audioUrl = this.getMediaUrl(question.media, 'audio');
        const videoUrl = this.getMediaUrl(question.media, 'video');
        const imageUrls = this.getMediaUrls(question.media, 'image');
        const audioUrls = this.getMediaUrls(question.media, 'audio');
        if (imageUrl)
            result.image = imageUrl;
        if (audioUrl)
            result.audio = audioUrl;
        if (videoUrl)
            result.video = videoUrl;
        if (imageUrls.length > 0)
            result.images = imageUrls;
        if (audioUrls.length > 0)
            result.audios = audioUrls;
        if (this.getConfigurationsIfNotEmpty(question.configurations)) {
            result.configurations = question.configurations;
        }
        return result;
    }
};
exports.QuestionFormatterService = QuestionFormatterService;
exports.QuestionFormatterService = QuestionFormatterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_service_1.FileService])
], QuestionFormatterService);
//# sourceMappingURL=question-formatter.service.js.map