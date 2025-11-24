"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFormatterService = void 0;
const common_1 = require("@nestjs/common");
let QuestionFormatterService = class QuestionFormatterService {
    getConfigurationsIfNotEmpty(configurations) {
        if (!configurations || Object.keys(configurations).length === 0) {
            return undefined;
        }
        return configurations;
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
            image: question.media?.find((m) => m.type === 'image') || null,
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
            image: question.media?.[0] || null,
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
            audio: question.media?.find((m) => m.type === 'audio' || m.type === 'video') ||
                null,
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
            image: question.media?.find((m) => m.type === 'image') || null,
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
            image: question.media?.find((m) => m.type === 'image') || null,
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
            audio: question.media?.find((m) => m.type === 'audio') || null,
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
            audio: question.media?.find((m) => m.type === 'audio') || null,
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
            video: question.media?.find((m) => m.type === 'video') ||
                null,
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
            images: question.media?.filter((m) => m.type === 'image') || [],
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
            image: question.media?.find((m) => m.type === 'image') ||
                null,
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
            image: question.media?.find((m) => m.type === 'image') || null,
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
            image: question.media?.find((m) => m.type === 'image') || null,
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
            image: question.media?.find((m) => m.type === 'image') || null,
            video: question.media?.find((m) => m.type === 'video') || null,
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
            image: question.media?.find((m) => m.type === 'image') || null,
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
            image: question.media?.find((m) => m.type === 'image') || null,
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
            image: question.media?.find((m) => m.type === 'image') || null,
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
    formatDefault(question) {
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
            options: question.options,
            answer: question.answer,
            media: question.media || [],
            ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
                configurations: question.configurations,
            }),
            subQuestions: question.subQuestions
                ?.map((sq) => this.formatQuestion(sq))
                .filter((q) => q !== null) || [],
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
};
exports.QuestionFormatterService = QuestionFormatterService;
exports.QuestionFormatterService = QuestionFormatterService = __decorate([
    (0, common_1.Injectable)()
], QuestionFormatterService);
//# sourceMappingURL=question-formatter.service.js.map