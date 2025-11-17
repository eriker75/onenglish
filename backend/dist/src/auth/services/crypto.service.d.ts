export declare class CryptoService {
    hashDataForStorage(data: string): string;
    verifyStoredHash(plainData: string, storedHash: string): boolean;
    changeData(oldData: string, newData: string, storedHash: string): {
        isValid: boolean;
        newHash?: string;
        message?: string;
    };
    resetData(newData: string): {
        isValid: boolean;
        newHash?: string;
        message?: string;
    };
    generateSecureToken(length?: number): string;
    testHashing(data: string): {
        hashed: string;
        isValid: boolean;
    };
    validateInputStrength(input: string): {
        isValid: boolean;
        message?: string;
    };
}
