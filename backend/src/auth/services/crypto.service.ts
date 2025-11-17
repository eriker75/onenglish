import { Injectable, BadRequestException } from '@nestjs/common';
import { CryptoUtils } from '../utils';

/**
 * Service class for cryptographic operations including password hashing and encryption
 * Provides business logic layer over CryptoUtils and other cryptographic utilities
 */
@Injectable()
export class CryptoService {
  /**
   * Hash data for storage
   * @param data - Plain text data
   * @returns Hashed data ready for database storage
   */
  hashDataForStorage(data: string) {
    try {
      // Validate data strength before hashing
      const validation = CryptoUtils.validateInputStrength(data);
      if (!validation.isValid) {
        throw new BadRequestException(validation.message);
      }

      return CryptoUtils.hashData(data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to hash data');
    }
  }

  /**
   * Verify data against stored hash
   * @param plainData - Plain text data from user input
   * @param storedHash - Hashed data from database
   * @returns Boolean indicating if data is valid
   */
  verifyStoredHash(plainData: string, storedHash: string) {
    try {
      if (!plainData || !storedHash) {
        return false;
      }

      return CryptoUtils.verifyHash(plainData, storedHash);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Invalid hash format') {
        // Log error for debugging but don't expose internal details
        console.error('Data verification error:', error.message);
        return false;
      } else {
        console.log('unexpected error during hash verification:', error);
        return false;
      }
    }
  }

  /**
   * Change user data (for data reset functionality)
   * @param oldData - Current data
   * @param newData - New data
   * @param storedHash - Current stored hash
   * @returns Object with validation result and new hash
   */
  changeData(
    oldData: string,
    newData: string,
    storedHash: string,
  ): { isValid: boolean; newHash?: string; message?: string } {
    try {
      // Verify old data first
      const isOldDataValid = this.verifyStoredHash(oldData, storedHash);
      if (!isOldDataValid) {
        return {
          isValid: false,
          message: 'Current data is incorrect',
        };
      }

      // Validate new data strength
      const validation = CryptoUtils.validateInputStrength(newData);
      if (!validation.isValid) {
        return {
          isValid: false,
          message: validation.message,
        };
      }

      // Check if new data is different from old data
      if (oldData === newData) {
        return {
          isValid: false,
          message: 'New data must be different from current data',
        };
      }

      // Hash new data
      const newHash = this.hashDataForStorage(newData);

      return {
        isValid: true,
        newHash,
        message: 'Data changed successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        isValid: false,
        message: 'Failed to change data',
      };
    }
  }

  /**
   * Reset data (for forgot data functionality)
   * @param newData - New data
   * @returns Object with validation result and new hash
   */
  resetData(newData: string): {
    isValid: boolean;
    newHash?: string;
    message?: string;
  } {
    try {
      // Validate new data strength
      const validation = CryptoUtils.validateInputStrength(newData);
      if (!validation.isValid) {
        return {
          isValid: false,
          message: validation.message,
        };
      }

      // Hash new data
      const newHash = this.hashDataForStorage(newData);

      return {
        isValid: true,
        newHash,
        message: 'Data reset successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        isValid: false,
        message: 'Failed to reset data',
      };
    }
  }

  /**
   * Generate a secure random token
   * @param length - Length of the token (default: 12)
   * @returns Generated secure token
   */
  generateSecureToken(length: number = 12): string {
    return CryptoUtils.generateSecureToken(length);
  }

  /**
   * Test hashing functionality
   * This method should be removed in production
   * @param data - Data to test
   * @returns Test results
   */
  testHashing(data: string): { hashed: string; isValid: boolean } {
    return CryptoUtils.testHashing(data);
  }

  /**
   * Validate input strength
   * @param input - Input data to validate
   * @returns Validation result
   */
  validateInputStrength(input: string): { isValid: boolean; message?: string } {
    return CryptoUtils.validateInputStrength(input);
  }
}
