import * as crypto from 'crypto';

/**
 * Utility class for cryptographic operations including password hashing and verification using Node.js crypto module
 * Uses PBKDF2 with SHA-512 for secure password hashing and other cryptographic utilities
 */
export class CryptoUtils {
  private static readonly SALT_LENGTH = 16; // 16 bytes
  private static readonly ITERATIONS = 10000;
  private static readonly KEY_LENGTH = 64; // 64 bytes
  private static readonly DIGEST = 'sha512';

  /**
   * Hash data using PBKDF2 with a random salt
   * @param data - Plain text data to hash
   * @returns Hashed data in format "salt:hash"
   */
  static hashData(data: string): string {
    if (!data || data.trim().length === 0) {
      throw new Error('Data cannot be empty');
    }

    const salt = crypto.randomBytes(this.SALT_LENGTH).toString('hex');
    const hash = crypto
      .pbkdf2Sync(data, salt, this.ITERATIONS, this.KEY_LENGTH, this.DIGEST)
      .toString('hex');

    return `${salt}:${hash}`;
  }

  /**
   * Verify data against its hash
   * @param data - Plain text data to verify
   * @param hashedData - Hashed data in format "salt:hash"
   * @returns Boolean indicating if data is valid
   */
  static verifyHash(data: string, hashedData: string): boolean {
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
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * Test method to verify hashing works correctly
   * This method should be removed in production
   * @param data - Data to test
   * @returns Object with hashed data and validation result
   */
  static testHashing(data: string): { hashed: string; isValid: boolean } {
    const hashed = this.hashData(data);
    const isValid = this.verifyHash(data, hashed);
    return { hashed, isValid };
  }

  /**
   * Check if input meets minimum security requirements
   * @param input - Input data to validate
   * @returns Object with validation result and error message
   */
  static validateInputStrength(input: string): {
    isValid: boolean;
    message?: string;
  } {
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

  /**
   * Generate a secure random token
   * @param length - Length of the token (default: 12)
   * @returns Random secure token string
   */
  static generateSecureToken(length: number = 12): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      token += charset[randomIndex];
    }

    return token;
  }
}
