export declare class CryptoUtils {
    private static readonly SALT_LENGTH;
    private static readonly ITERATIONS;
    private static readonly KEY_LENGTH;
    private static readonly DIGEST;
    static hashData(data: string): string;
    static verifyHash(data: string, hashedData: string): boolean;
    static testHashing(data: string): {
        hashed: string;
        isValid: boolean;
    };
    static validateInputStrength(input: string): {
        isValid: boolean;
        message?: string;
    };
    static generateSecureToken(length?: number): string;
}
