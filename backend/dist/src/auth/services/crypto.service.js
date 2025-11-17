"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
let CryptoService = class CryptoService {
    hashDataForStorage(data) {
        try {
            const validation = utils_1.CryptoUtils.validateInputStrength(data);
            if (!validation.isValid) {
                throw new common_1.BadRequestException(validation.message);
            }
            return utils_1.CryptoUtils.hashData(data);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to hash data');
        }
    }
    verifyStoredHash(plainData, storedHash) {
        try {
            if (!plainData || !storedHash) {
                return false;
            }
            return utils_1.CryptoUtils.verifyHash(plainData, storedHash);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Invalid hash format') {
                console.error('Data verification error:', error.message);
                return false;
            }
            else {
                console.log('unexpected error during hash verification:', error);
                return false;
            }
        }
    }
    changeData(oldData, newData, storedHash) {
        try {
            const isOldDataValid = this.verifyStoredHash(oldData, storedHash);
            if (!isOldDataValid) {
                return {
                    isValid: false,
                    message: 'Current data is incorrect',
                };
            }
            const validation = utils_1.CryptoUtils.validateInputStrength(newData);
            if (!validation.isValid) {
                return {
                    isValid: false,
                    message: validation.message,
                };
            }
            if (oldData === newData) {
                return {
                    isValid: false,
                    message: 'New data must be different from current data',
                };
            }
            const newHash = this.hashDataForStorage(newData);
            return {
                isValid: true,
                newHash,
                message: 'Data changed successfully',
            };
        }
        catch (error) {
            console.log(error);
            return {
                isValid: false,
                message: 'Failed to change data',
            };
        }
    }
    resetData(newData) {
        try {
            const validation = utils_1.CryptoUtils.validateInputStrength(newData);
            if (!validation.isValid) {
                return {
                    isValid: false,
                    message: validation.message,
                };
            }
            const newHash = this.hashDataForStorage(newData);
            return {
                isValid: true,
                newHash,
                message: 'Data reset successfully',
            };
        }
        catch (error) {
            console.log(error);
            return {
                isValid: false,
                message: 'Failed to reset data',
            };
        }
    }
    generateSecureToken(length = 12) {
        return utils_1.CryptoUtils.generateSecureToken(length);
    }
    testHashing(data) {
        return utils_1.CryptoUtils.testHashing(data);
    }
    validateInputStrength(input) {
        return utils_1.CryptoUtils.validateInputStrength(input);
    }
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = __decorate([
    (0, common_1.Injectable)()
], CryptoService);
//# sourceMappingURL=crypto.service.js.map