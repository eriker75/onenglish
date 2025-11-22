"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERB_TENSES = exports.EVALUATION_METHODS = exports.SKILL_CATEGORIES = exports.QUESTION_DIFFICULTY_LEVELS = exports.VALID_QUESTIONS_TYPES = void 0;
exports.VALID_QUESTIONS_TYPES = [
    'multiple_choice',
    'fill_blank',
    'audio_question',
    'speaking_practice',
    'matching',
    'ordering',
    'true_false',
    'short_answer',
    'essay',
    'listening_comprehension',
];
exports.QUESTION_DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];
exports.SKILL_CATEGORIES = [
    'listening',
    'speaking',
    'grammar',
    'vocabulary',
    'reading',
    'writing',
];
exports.EVALUATION_METHODS = ['auto', 'manual'];
var VERB_TENSES;
(function (VERB_TENSES) {
    VERB_TENSES["PRESENT_SIMPLE"] = "present_simple";
    VERB_TENSES["PAST_SIMPLE"] = "past_simple";
    VERB_TENSES["FUTURE_SIMPLE"] = "future_simple";
    VERB_TENSES["PRESENT_CONTINUOUS"] = "present_continuous";
    VERB_TENSES["PAST_CONTINUOUS"] = "past_continuous";
    VERB_TENSES["FUTURE_CONTINUOUS"] = "future_continuous";
    VERB_TENSES["PRESENT_PERFECT"] = "present_perfect";
    VERB_TENSES["PAST_PERFECT"] = "past_perfect";
    VERB_TENSES["FUTURE_PERFECT"] = "future_perfect";
})(VERB_TENSES || (exports.VERB_TENSES = VERB_TENSES = {}));
//# sourceMappingURL=constants.js.map