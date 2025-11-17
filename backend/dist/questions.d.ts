export type QuestionStage = 'VOCABULARY' | 'GRAMMAR' | 'LISTENING' | 'WRITING' | 'SPEAKING';
export type ValidationMethod = 'AUTO' | 'IA';
export declare enum ValidTenses {
    PRESENT_SIMPLE = "present_simple",
    PAST_SIMPLE = "past_simple",
    FUTURE_SIMPLE = "future_simple",
    PRESENT_CONTINUOUS = "present_continuous",
    PAST_CONTINUOUS = "past_continuous",
    FUTURE_CONTINUOUS = "future_continuous",
    PRESENT_PERFECT = "present_perfect",
    PAST_PERFECT = "past_perfect",
    FUTURE_PERFECT = "future_perfect"
}
export declare const IMAGE_TO_MULTIPLE_CHOICES: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    mediaType: string;
    mediaCount: number;
    hasOptions: boolean;
    hasFixedAnswer: boolean;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        media: string;
        options: string[];
        answer: string;
    };
};
export declare const WORDBOX: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasContent: boolean;
    contentStructure: string;
    hasFixedAnswer: boolean;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        content: string[][];
        configurations: {
            gridWidth: string;
            gridHeight: string;
            minWordLength: string;
        };
    };
};
export declare const SPELLING: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    mediaType: string;
    mediaCount: number;
    answerType: string;
    hasFixedAnswer: boolean;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        media: string;
        answer: string;
    };
};
export declare const WORD_ASSOCIATIONS: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasContent: boolean;
    contentStructure: string;
    answerType: string;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        content: string;
        configurations: {
            totalAssociations: string;
            minAssociations: string;
        };
    };
};
export declare const UNSCRAMBLE: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasContent: boolean;
    contentStructure: string;
    hasFixedAnswer: boolean;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        content: string[];
        answer: string;
    };
};
export declare const TENSES: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasOptions: boolean;
    hasFixedAnswer: boolean;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        options: ValidTenses[];
        answer: ValidTenses;
    };
};
export declare const TAG_IT: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasOptions: boolean;
    hasMultipleCorrectAnswers: boolean;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        options: string[];
        answer: string[];
    };
};
export declare const REPORT_IT: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasContent: boolean;
    contentStructure: string;
    answerType: string;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        content: string;
        answer: string;
    };
};
export declare const READ_IT: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasContent: boolean;
    contentStructure: string;
    hasSubQuestions: boolean;
    subQuestionType: string;
    pointsCalculation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: string;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        content: {
            text: string;
        }[];
        subQuestions: {
            content: string;
            options: boolean[];
            answer: boolean;
            points: number;
        }[];
    };
};
export declare const WORD_MATCH: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    mediaType: string;
    mediaCount: string;
    hasOptions: boolean;
    hasFixedAnswer: boolean;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        media: string;
        options: string[];
        answer: string;
    };
};
export declare const GOSSIP: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    mediaType: string;
    mediaCount: number;
    answerType: string;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        media: string;
        answer: string;
    };
};
export declare const TOPIC_BASED_AUDIO: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    mediaType: string;
    mediaCount: number;
    hasSubQuestions: boolean;
    subQuestionType: string;
    pointsCalculation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: string;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        media: string;
        subQuestions: {
            text: string;
            options: {
                id: string;
                text: string;
            }[];
            answer: string;
            points: number;
        }[];
    };
};
export declare const LYRICS_TRAINING: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    mediaType: string;
    mediaCount: number;
    hasFixedAnswer: boolean;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        media: string;
        content: string;
        answer: string;
    };
};
export declare const SENTENCE_MAKER: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    mediaType: string;
    mediaCount: string;
    answerType: string;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        media: string;
    };
};
export declare const FAST_TEST: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasContent: boolean;
    contentStructure: string;
    hasOptions: boolean;
    hasFixedAnswer: boolean;
    note: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        content: string[];
        options: string[];
        answer: string;
    };
};
export declare const TALES: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    mediaType: string;
    mediaCount: string;
    answerType: string;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        media: string;
        configurations: {
            minWords: string;
            maxWords: string;
        };
    };
};
export declare const SUPERBRAIN: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    answerType: string;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
    };
};
export declare const TELL_ME_ABOUT_IT: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    answerType: string;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
    };
};
export declare const DEBATE: {
    type: string;
    stage: string;
    validationMethod: string;
    description: string;
    mediaRequired: boolean;
    hasContent: boolean;
    contentStructure: string;
    answerType: string;
    aiValidation: string;
    example: {
        challengeId: string;
        stage: string;
        phase: string;
        position: number;
        type: string;
        points: number;
        timeLimit: number;
        maxAttempts: number;
        text: string;
        instructions: string;
        validationMethod: string;
        content: string;
        configurations: {
            stanceOptions: string;
        };
    };
};
export interface QuestionTemplate {
    challengeId: string;
    stage: QuestionStage;
    phase: string;
    position: number;
    type: string;
    points: number;
    timeLimit: number;
    maxAttempts: number;
    text: string;
    instructions: string;
    validationMethod: ValidationMethod;
    content?: unknown;
    options?: unknown[];
    answer?: string | string[] | boolean;
    parentQuestionId?: string;
    subQuestions?: Partial<QuestionTemplate>[];
    configurations?: Record<string, string>;
}
export declare const QUESTION_TYPE_SUMMARY: {
    total: number;
    byStage: {
        VOCABULARY: number;
        GRAMMAR: number;
        LISTENING: number;
        WRITING: number;
        SPEAKING: number;
    };
    byValidation: {
        AUTO: number;
        IA: number;
    };
    withMedia: {
        required: number;
        optional: number;
        none: number;
    };
    withSubQuestions: number;
};
