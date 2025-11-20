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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionValidationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const ai_files_service_1 = require("../../ai-files/ai-files.service");
const ai_service_1 = require("../../ai/ai.service");
const file_type_enum_1 = require("../../ai-files/enums/file-type.enum");
let QuestionValidationService = class QuestionValidationService {
    prisma;
    aiFilesService;
    aiService;
    constructor(prisma, aiFilesService, aiService) {
        this.prisma = prisma;
        this.aiFilesService = aiFilesService;
        this.aiService = aiService;
    }
    parseAIResponse(response) {
        if (typeof response === 'string') {
            return JSON.parse(response);
        }
        if (Array.isArray(response)) {
            const textContent = response
                .map((block) => (block.text ? block.text : JSON.stringify(block)))
                .join('');
            return JSON.parse(textContent);
        }
        return response;
    }
    async validateAnswer(questionId, userAnswer, audioFile) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: {
                subQuestions: true,
                questionMedia: {
                    include: { mediaFile: true },
                },
                configurations: true,
            },
        });
        if (!question) {
            throw new common_1.BadRequestException('Question not found');
        }
        switch (question.type) {
            case 'image_to_multiple_choices':
                return this.validateMultipleChoice(question, userAnswer);
            case 'unscramble':
                return this.validateUnscramble(question, userAnswer);
            case 'tenses':
                return this.validateTenses(question, userAnswer);
            case 'tag_it':
                return this.validateTagIt(question, userAnswer);
            case 'read_it':
                return this.validateReadIt(question, userAnswer);
            case 'word_match':
                return this.validateWordMatch(question, userAnswer);
            case 'topic_based_audio':
                return this.validateTopicBasedAudio(question, userAnswer);
            case 'lyrics_training':
                return this.validateLyricsTraining(question, userAnswer);
            case 'fast_test':
                return this.validateFastTest(question, userAnswer);
            case 'wordbox':
                return this.validateWordbox(question, userAnswer);
            case 'spelling':
                return this.validateSpelling(question, audioFile);
            case 'word_associations':
                return this.validateWordAssociations(question, userAnswer);
            case 'report_it':
                return this.validateReportIt(question, userAnswer);
            case 'gossip':
                return this.validateGossip(question, audioFile);
            case 'sentence_maker':
                return this.validateSentenceMaker(question, userAnswer);
            case 'tales':
                return this.validateTales(question, userAnswer);
            case 'superbrain':
                return this.validateSuperbrain(question, audioFile);
            case 'tell_me_about_it':
                return this.validateTellMeAboutIt(question, audioFile);
            case 'debate':
                return this.validateDebate(question, audioFile);
            default:
                throw new common_1.BadRequestException(`Unknown question type: ${question.type}`);
        }
    }
    async validateMultipleChoice(question, userAnswer) {
        const correctAnswer = question.answer;
        const isCorrect = userAnswer === correctAnswer;
        return {
            isCorrect,
            pointsEarned: isCorrect ? question.points : 0,
        };
    }
    async validateUnscramble(question, userAnswer) {
        const correctAnswer = question.answer.toLowerCase().trim();
        const userAnswerNormalized = userAnswer.toLowerCase().trim();
        const isCorrect = userAnswerNormalized === correctAnswer;
        return {
            isCorrect,
            pointsEarned: isCorrect ? question.points : 0,
        };
    }
    async validateTenses(question, userAnswer) {
        const correctAnswer = question.answer;
        const isCorrect = userAnswer === correctAnswer;
        return {
            isCorrect,
            pointsEarned: isCorrect ? question.points : 0,
        };
    }
    async validateTagIt(question, userAnswer) {
        const correctAnswers = question.answer;
        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
        const isCorrect = correctAnswers.some((correctAnswer) => correctAnswer.toLowerCase().trim() === normalizedUserAnswer);
        return {
            isCorrect,
            pointsEarned: isCorrect ? question.points : 0,
        };
    }
    async validateReadIt(question, userAnswer) {
        let totalPoints = 0;
        let earnedPoints = 0;
        for (const subQuestion of question.subQuestions) {
            totalPoints += subQuestion.points;
            const subUserAnswer = userAnswer[subQuestion.id];
            if (subUserAnswer === subQuestion.answer) {
                earnedPoints += subQuestion.points;
            }
        }
        const isCorrect = earnedPoints === totalPoints;
        return {
            isCorrect,
            pointsEarned: earnedPoints,
            details: {
                totalQuestions: question.subQuestions.length,
                correctAnswers: earnedPoints / (totalPoints / question.subQuestions.length),
            },
        };
    }
    async validateWordMatch(question, userAnswer) {
        const correctAnswer = question.answer;
        const isCorrect = userAnswer === correctAnswer;
        return {
            isCorrect,
            pointsEarned: isCorrect ? question.points : 0,
        };
    }
    async validateTopicBasedAudio(question, userAnswer) {
        let totalPoints = 0;
        let earnedPoints = 0;
        for (const subQuestion of question.subQuestions) {
            totalPoints += subQuestion.points;
            const subUserAnswer = userAnswer[subQuestion.id];
            if (subUserAnswer === subQuestion.answer) {
                earnedPoints += subQuestion.points;
            }
        }
        const isCorrect = earnedPoints === totalPoints;
        return {
            isCorrect,
            pointsEarned: earnedPoints,
            details: {
                totalQuestions: question.subQuestions.length,
                correctAnswers: earnedPoints / (totalPoints / question.subQuestions.length),
            },
        };
    }
    async validateLyricsTraining(question, userAnswer) {
        const correctAnswer = question.answer;
        const isCorrect = userAnswer === correctAnswer;
        return {
            isCorrect,
            pointsEarned: isCorrect ? question.points : 0,
        };
    }
    async validateFastTest(question, userAnswer) {
        const correctAnswer = question.answer;
        const isCorrect = userAnswer === correctAnswer;
        return {
            isCorrect,
            pointsEarned: isCorrect ? question.points : 0,
        };
    }
    canFormWordFromGrid(word, grid) {
        if (!grid || !Array.isArray(grid) || grid.length === 0) {
            return false;
        }
        const availableLetters = grid
            .flat()
            .map((letter) => letter.toLowerCase());
        const availableFrequency = {};
        for (const letter of availableLetters) {
            availableFrequency[letter] = (availableFrequency[letter] || 0) + 1;
        }
        const wordLowerCase = word.toLowerCase();
        const wordFrequency = {};
        for (const letter of wordLowerCase) {
            wordFrequency[letter] = (wordFrequency[letter] || 0) + 1;
        }
        for (const letter in wordFrequency) {
            if (!availableFrequency[letter] || availableFrequency[letter] < wordFrequency[letter]) {
                return false;
            }
        }
        return true;
    }
    async validateWordbox(question, userAnswer) {
        const grid = question.content;
        if (!grid || !Array.isArray(grid)) {
            throw new common_1.BadRequestException('Invalid wordbox grid structure');
        }
        const maxWordsConfig = question.configurations?.find((config) => config.metaKey === 'maxWords');
        const maxWords = maxWordsConfig ? parseInt(maxWordsConfig.metaValue) : 5;
        const wordsNotInGrid = [];
        const wordsInGrid = [];
        for (const word of userAnswer) {
            if (this.canFormWordFromGrid(word, grid)) {
                wordsInGrid.push(word);
            }
            else {
                wordsNotInGrid.push(word);
            }
        }
        if (wordsInGrid.length === 0) {
            return {
                isCorrect: false,
                pointsEarned: 0,
                feedbackEnglish: `None of your words can be formed from the available letters.`,
                feedbackSpanish: `Ninguna de tus palabras se puede formar con las letras disponibles.`,
                details: {
                    wordsInGrid: [],
                    wordsNotInGrid,
                    validWords: [],
                    invalidWords: [],
                    totalWords: userAnswer.length,
                    maxWords,
                },
            };
        }
        const systemPrompt = `You are an English vocabulary validator. Validate if the following words are valid English words.
Return a JSON object with this structure:
{
  "validWords": ["word1", "word2"],
  "invalidWords": ["word3"],
  "feedbackEnglish": "You formed X valid words.",
  "feedbackSpanish": "Formaste X palabras válidas."
}`;
        const userPrompt = `Words to validate: ${wordsInGrid.join(', ')}`;
        console.log('Wordbox validation - Words in grid:', wordsInGrid);
        console.log('Wordbox validation - Words not in grid:', wordsNotInGrid);
        console.log('Wordbox validation - MaxWords:', maxWords);
        try {
            const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
            console.log('Wordbox validation - Calling AI with prompt:', fullPrompt);
            const response = await this.aiService.invoke(fullPrompt);
            console.log('Wordbox validation - AI raw response:', response);
            const result = this.parseAIResponse(response);
            const validWords = result.validWords || [];
            const invalidWords = result.invalidWords || [];
            const pointsEarned = Math.round((validWords.length / maxWords) * question.points);
            const isCorrect = invalidWords.length === 0 && wordsNotInGrid.length === 0;
            let feedbackEnglish = '';
            let feedbackSpanish = '';
            if (wordsNotInGrid.length > 0) {
                feedbackEnglish = `Words not in grid: ${wordsNotInGrid.join(', ')}. `;
                feedbackSpanish = `Palabras no en la cuadrícula: ${wordsNotInGrid.join(', ')}. `;
            }
            if (invalidWords.length > 0) {
                feedbackEnglish += `Invalid English words: ${invalidWords.join(', ')}. `;
                feedbackSpanish += `Palabras inválidas en inglés: ${invalidWords.join(', ')}. `;
            }
            feedbackEnglish += `You formed ${validWords.length} valid word(s) out of ${maxWords} needed. Points earned: ${pointsEarned}/${question.points}`;
            feedbackSpanish += `Formaste ${validWords.length} palabra(s) válida(s) de ${maxWords} necesarias. Puntos obtenidos: ${pointsEarned}/${question.points}`;
            return {
                isCorrect,
                pointsEarned,
                feedbackEnglish,
                feedbackSpanish,
                details: {
                    wordsInGrid,
                    wordsNotInGrid,
                    validWords,
                    invalidWords,
                    totalWords: userAnswer.length,
                    maxWords,
                },
            };
        }
        catch (error) {
            console.error('Error validating wordbox with AI:', error);
            throw new common_1.BadRequestException(`Error validating wordbox with AI: ${error.message || 'Unknown error'}`);
        }
    }
    async validateSpelling(question, audioFile) {
        if (!audioFile) {
            throw new common_1.BadRequestException('Audio file is required for spelling validation');
        }
        const expectedWord = question.answer;
        const fileInput = {
            data: audioFile.buffer.toString('base64'),
            mimeType: audioFile.mimetype,
            fileType: file_type_enum_1.FileType.AUDIO,
            fileName: audioFile.originalname,
        };
        try {
            const result = await this.aiFilesService.validateSpellingFromAudio(fileInput, expectedWord);
            if (!result.success) {
                throw new common_1.BadRequestException('Error validating spelling');
            }
            const isCorrect = result.data.isCorrect;
            const pointsEarned = isCorrect ? question.points : 0;
            return {
                isCorrect,
                pointsEarned,
                feedbackEnglish: `You spelled: "${result.data.speltWord}". ${result.data.analysis}`,
                feedbackSpanish: `Deletreaste: "${result.data.speltWord}". ${result.data.analysis}`,
                details: result.data,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating spelling with AI');
        }
    }
    async validateWordAssociations(question, userAnswer) {
        const centralWord = question.content;
        const systemPrompt = `You are an English vocabulary expert. Evaluate if the following words are semantically related to the central word "${centralWord}".
Rate the overall quality of associations on a scale of 0-1 and provide feedback.
Return a JSON object with this structure:
{
  "score": 0.85,
  "validAssociations": ["word1", "word2"],
  "weakAssociations": ["word3"],
  "feedbackEnglish": "Good associations! Most words are strongly related to ${centralWord}.",
  "feedbackSpanish": "¡Buenas asociaciones! La mayoría de las palabras están fuertemente relacionadas con ${centralWord}."
}`;
        const userPrompt = `Central word: "${centralWord}"\nUser's associations: ${userAnswer.join(', ')}`;
        try {
            const response = await this.aiService.invoke(`${systemPrompt}\n\n${userPrompt}`);
            const result = this.parseAIResponse(response);
            const score = result.score || 0;
            const pointsEarned = Math.round(question.points * score);
            return {
                isCorrect: score >= 0.6,
                pointsEarned,
                feedbackEnglish: result.feedbackEnglish,
                feedbackSpanish: result.feedbackSpanish,
                details: result,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating word associations with AI');
        }
    }
    async validateReportIt(question, userAnswer) {
        const originalSentence = question.content;
        const expectedAnswer = question.answer;
        const systemPrompt = `You are an English grammar expert specializing in reported speech.
Evaluate if the user's reported speech transformation is correct.
Original sentence: "${originalSentence}"
Expected answer: "${expectedAnswer}"
User's answer: "${userAnswer}"

Return a JSON object with this structure:
{
  "score": 0.95,
  "isCorrect": true,
  "feedbackEnglish": "Excellent! Your reported speech is grammatically correct.",
  "feedbackSpanish": "¡Excelente! Tu discurso indirecto es gramaticalmente correcto."
}`;
        try {
            const response = await this.aiService.invoke(systemPrompt);
            const result = this.parseAIResponse(response);
            const isCorrect = result.isCorrect || result.score >= 0.8;
            const pointsEarned = isCorrect ? question.points : 0;
            return {
                isCorrect,
                pointsEarned,
                feedbackEnglish: result.feedbackEnglish,
                feedbackSpanish: result.feedbackSpanish,
                details: result,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating reported speech with AI');
        }
    }
    async validateGossip(question, audioFile) {
        if (!audioFile) {
            throw new common_1.BadRequestException('Audio file is required for gossip validation');
        }
        const expectedTranscription = question.answer;
        const fileInput = {
            data: audioFile.buffer.toString('base64'),
            mimeType: audioFile.mimetype,
            fileType: file_type_enum_1.FileType.AUDIO,
            fileName: audioFile.originalname,
        };
        const systemPrompt = `You are a transcription and pronunciation expert.
Transcribe the audio accurately and compare it with the expected transcription.
Expected transcription: "${expectedTranscription}"

Return a JSON object with this structure:
{
  "transcription": "user's transcribed audio",
  "score": 0.9,
  "pronunciationScore": 0.85,
  "accuracyScore": 0.95,
  "feedbackEnglish": "Great pronunciation and accuracy!",
  "feedbackSpanish": "¡Excelente pronunciación y precisión!"
}`;
        try {
            const result = await this.aiFilesService.processSingleFile(fileInput, systemPrompt, undefined, 0.2);
            if (!result.success) {
                throw new common_1.BadRequestException('Error processing audio');
            }
            const aiResult = JSON.parse(result.data);
            const score = aiResult.score || 0;
            const pointsEarned = Math.round(question.points * score);
            return {
                isCorrect: score >= 0.7,
                pointsEarned,
                feedbackEnglish: aiResult.feedbackEnglish,
                feedbackSpanish: aiResult.feedbackSpanish,
                details: aiResult,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating gossip with AI');
        }
    }
    async validateSentenceMaker(question, userAnswer) {
        const systemPrompt = `You are an English writing expert. Evaluate the user's sentence based on:
1. Grammar correctness (40%)
2. Vocabulary usage (30%)
3. Coherence with provided images (30%)

Return a JSON object with this structure:
{
  "grammarScore": 0.9,
  "vocabularyScore": 0.85,
  "coherenceScore": 0.8,
  "overallScore": 0.85,
  "feedbackEnglish": "Good sentence! Minor grammar improvements needed.",
  "feedbackSpanish": "¡Buena oración! Se necesitan pequeñas mejoras gramaticales."
}`;
        const userPrompt = `User's sentence: "${userAnswer}"`;
        try {
            const response = await this.aiService.invoke(`${systemPrompt}\n\n${userPrompt}`);
            const result = this.parseAIResponse(response);
            const score = result.overallScore || 0;
            const pointsEarned = Math.round(question.points * score);
            return {
                isCorrect: score >= 0.6,
                pointsEarned,
                feedbackEnglish: result.feedbackEnglish,
                feedbackSpanish: result.feedbackSpanish,
                details: result,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating sentence with AI');
        }
    }
    async validateTales(question, userAnswer) {
        const systemPrompt = `You are a creative writing expert. Evaluate the user's story based on:
1. Coherence and logical flow (30%)
2. Creativity and originality (30%)
3. Grammar and vocabulary (25%)
4. Use of provided image prompts (15%)

Return a JSON object with this structure:
{
  "coherenceScore": 0.85,
  "creativityScore": 0.9,
  "grammarScore": 0.8,
  "imageUsageScore": 0.75,
  "overallScore": 0.83,
  "feedbackEnglish": "Excellent story! Very creative with good grammar.",
  "feedbackSpanish": "¡Excelente historia! Muy creativa con buena gramática."
}`;
        const userPrompt = `User's story: "${userAnswer}"`;
        try {
            const response = await this.aiService.invoke(`${systemPrompt}\n\n${userPrompt}`);
            const result = this.parseAIResponse(response);
            const score = result.overallScore || 0;
            const pointsEarned = Math.round(question.points * score);
            return {
                isCorrect: score >= 0.6,
                pointsEarned,
                feedbackEnglish: result.feedbackEnglish,
                feedbackSpanish: result.feedbackSpanish,
                details: result,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating tale with AI');
        }
    }
    async validateSuperbrain(question, audioFile) {
        if (!audioFile) {
            throw new common_1.BadRequestException('Audio file is required for superbrain validation');
        }
        const fileInput = {
            data: audioFile.buffer.toString('base64'),
            mimeType: audioFile.mimetype,
            fileType: file_type_enum_1.FileType.AUDIO,
            fileName: audioFile.originalname,
        };
        const systemPrompt = `You are an English speaking expert. Evaluate the audio response based on:
1. Pronunciation and fluency (30%)
2. Grammar and vocabulary (30%)
3. Content relevance to the question (25%)
4. Coherence and organization (15%)

Question: "${question.text}"

Return a JSON object with this structure:
{
  "pronunciationScore": 0.85,
  "grammarScore": 0.8,
  "relevanceScore": 0.9,
  "coherenceScore": 0.85,
  "overallScore": 0.84,
  "feedbackEnglish": "Good pronunciation and relevant content!",
  "feedbackSpanish": "¡Buena pronunciación y contenido relevante!"
}`;
        try {
            const result = await this.aiFilesService.processSingleFile(fileInput, systemPrompt, undefined, 0.2);
            if (!result.success) {
                throw new common_1.BadRequestException('Error processing audio');
            }
            const aiResult = JSON.parse(result.data);
            const score = aiResult.overallScore || 0;
            const pointsEarned = Math.round(question.points * score);
            return {
                isCorrect: score >= 0.6,
                pointsEarned,
                feedbackEnglish: aiResult.feedbackEnglish,
                feedbackSpanish: aiResult.feedbackSpanish,
                details: aiResult,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating superbrain with AI');
        }
    }
    async validateTellMeAboutIt(question, audioFile) {
        if (!audioFile) {
            throw new common_1.BadRequestException('Audio file is required for tell_me_about_it validation');
        }
        const fileInput = {
            data: audioFile.buffer.toString('base64'),
            mimeType: audioFile.mimetype,
            fileType: file_type_enum_1.FileType.AUDIO,
            fileName: audioFile.originalname,
        };
        const systemPrompt = `You are a storytelling and English speaking expert. Evaluate the audio story based on:
1. Storytelling quality (25%)
2. Pronunciation and fluency (25%)
3. Grammar and vocabulary (25%)
4. Creativity and engagement (25%)

Return a JSON object with this structure:
{
  "storytellingScore": 0.85,
  "pronunciationScore": 0.8,
  "grammarScore": 0.85,
  "creativityScore": 0.9,
  "overallScore": 0.85,
  "feedbackEnglish": "Engaging story with good pronunciation!",
  "feedbackSpanish": "¡Historia interesante con buena pronunciación!"
}`;
        try {
            const result = await this.aiFilesService.processSingleFile(fileInput, systemPrompt, undefined, 0.2);
            if (!result.success) {
                throw new common_1.BadRequestException('Error processing audio');
            }
            const aiResult = JSON.parse(result.data);
            const score = aiResult.overallScore || 0;
            const pointsEarned = Math.round(question.points * score);
            return {
                isCorrect: score >= 0.6,
                pointsEarned,
                feedbackEnglish: aiResult.feedbackEnglish,
                feedbackSpanish: aiResult.feedbackSpanish,
                details: aiResult,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating story with AI');
        }
    }
    async validateDebate(question, audioFile) {
        if (!audioFile) {
            throw new common_1.BadRequestException('Audio file is required for debate validation');
        }
        const fileInput = {
            data: audioFile.buffer.toString('base64'),
            mimeType: audioFile.mimetype,
            fileType: file_type_enum_1.FileType.AUDIO,
            fileName: audioFile.originalname,
        };
        const systemPrompt = `You are a debate and argumentation expert. Evaluate the audio debate response based on:
1. Argument clarity and logic (30%)
2. Supporting evidence and examples (25%)
3. Pronunciation and fluency (25%)
4. Persuasiveness (20%)

Topic: "${question.text}"

Return a JSON object with this structure:
{
  "clarityScore": 0.85,
  "evidenceScore": 0.8,
  "pronunciationScore": 0.85,
  "persuasivenessScore": 0.9,
  "overallScore": 0.85,
  "feedbackEnglish": "Strong arguments with good supporting evidence!",
  "feedbackSpanish": "¡Argumentos sólidos con buena evidencia de apoyo!"
}`;
        try {
            const result = await this.aiFilesService.processSingleFile(fileInput, systemPrompt, undefined, 0.2);
            if (!result.success) {
                throw new common_1.BadRequestException('Error processing audio');
            }
            const aiResult = JSON.parse(result.data);
            const score = aiResult.overallScore || 0;
            const pointsEarned = Math.round(question.points * score);
            return {
                isCorrect: score >= 0.6,
                pointsEarned,
                feedbackEnglish: aiResult.feedbackEnglish,
                feedbackSpanish: aiResult.feedbackSpanish,
                details: aiResult,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error validating debate with AI');
        }
    }
};
exports.QuestionValidationService = QuestionValidationService;
exports.QuestionValidationService = QuestionValidationService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('QUESTIONS_AI')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_files_service_1.AiFilesService,
        ai_service_1.AiService])
], QuestionValidationService);
//# sourceMappingURL=question-validation.service.js.map