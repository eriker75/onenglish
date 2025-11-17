"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtils = void 0;
const crypto = __importStar(require("crypto"));
class CryptoUtils {
    static SALT_LENGTH = 16;
    static ITERATIONS = 10000;
    static KEY_LENGTH = 64;
    static DIGEST = 'sha512';
    static hashData(data) {
        if (!data || data.trim().length === 0) {
            throw new Error('Data cannot be empty');
        }
        const salt = crypto.randomBytes(this.SALT_LENGTH).toString('hex');
        const hash = crypto
            .pbkdf2Sync(data, salt, this.ITERATIONS, this.KEY_LENGTH, this.DIGEST)
            .toString('hex');
        return `${salt}:${hash}`;
    }
    static verifyHash(data, hashedData) {
        if (!data || !hashedData) {
            return false;
        }
        try {
            const [salt, hash] = hashedData.split(':');
            if (!salt || !hash) {
                return false;
            }
            const verifyHash = crypto
                .pbkdf2Sync(data, salt, this.ITERATIONS, this.KEY_LENGTH, this.DIGEST)
                .toString('hex');
            return hash === verifyHash;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    static testHashing(data) {
        const hashed = this.hashData(data);
        const isValid = this.verifyHash(data, hashed);
        return { hashed, isValid };
    }
    static validateInputStrength(input) {
        if (!input) {
            return { isValid: false, message: 'Input is required' };
        }
        if (input.length < 6) {
            return {
                isValid: false,
                message: 'Input must be at least 6 characters long',
            };
        }
        if (input.length > 128) {
            return {
                isValid: false,
                message: 'Input must be less than 128 characters',
            };
        }
        return { isValid: true };
    }
    static generateSecureToken(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let token = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, charset.length);
            token += charset[randomIndex];
        }
        return token;
    }
}
exports.CryptoUtils = CryptoUtils;
//# sourceMappingURL=crypto.utils.js.map