/**
 * Utility to detect file type based on file extension and MIME type
 */

export type FileType = 'image' | 'voice' | 'document' | 'video';

interface FileTypeMapping {
  extensions: string[];
  mimeTypes: string[];
}

const FILE_TYPE_MAPPINGS: Record<FileType, FileTypeMapping> = {
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.avif'],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/x-icon',
      'image/avif',
    ],
  },
  voice: {
    extensions: ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'],
    mimeTypes: [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'audio/aac',
      'audio/flac',
      'audio/x-m4a',
    ],
  },
  video: {
    extensions: ['.mp4', '.webm', '.avi', '.mov', '.mkv', '.flv'],
    mimeTypes: [
      'video/mp4',
      'video/webm',
      'video/x-msvideo',
      'video/quicktime',
      'video/x-matroska',
      'video/x-flv',
    ],
  },
  document: {
    extensions: [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.txt',
      '.csv',
    ],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
    ],
  },
};

/**
 * Detects file type based on file extension
 * @param filename - The name of the file with extension
 * @returns The detected file type or null if unknown
 */
export function detectFileTypeByExtension(filename: string): FileType | null {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

  for (const [type, mapping] of Object.entries(FILE_TYPE_MAPPINGS)) {
    if (mapping.extensions.includes(extension)) {
      return type as FileType;
    }
  }

  return null;
}

/**
 * Detects file type based on MIME type
 * @param mimeType - The MIME type of the file
 * @returns The detected file type or null if unknown
 */
export function detectFileTypeByMimeType(mimeType: string): FileType | null {
  for (const [type, mapping] of Object.entries(FILE_TYPE_MAPPINGS)) {
    if (mapping.mimeTypes.includes(mimeType)) {
      return type as FileType;
    }
  }

  return null;
}

/**
 * Detects file type using both extension and MIME type
 * Prioritizes MIME type over extension
 * @param filename - The name of the file with extension
 * @param mimeType - The MIME type of the file
 * @returns The detected file type
 * @throws Error if file type cannot be determined
 */
export function detectFileType(filename: string, mimeType: string): FileType {
  // Try MIME type first (more reliable)
  const typeFromMime = detectFileTypeByMimeType(mimeType);
  if (typeFromMime) {
    return typeFromMime;
  }

  // Fallback to extension
  const typeFromExtension = detectFileTypeByExtension(filename);
  if (typeFromExtension) {
    return typeFromExtension;
  }

  throw new Error(
    `Unsupported file type. Filename: ${filename}, MIME type: ${mimeType}`,
  );
}

/**
 * Validates if a file type is supported
 * @param filename - The name of the file with extension
 * @param mimeType - The MIME type of the file
 * @returns true if supported, false otherwise
 */
export function isFileTypeSupported(
  filename: string,
  mimeType: string,
): boolean {
  try {
    detectFileType(filename, mimeType);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets all supported extensions
 * @returns Array of all supported file extensions
 */
export function getSupportedExtensions(): string[] {
  const extensions: string[] = [];
  for (const mapping of Object.values(FILE_TYPE_MAPPINGS)) {
    extensions.push(...mapping.extensions);
  }
  return extensions;
}

/**
 * Gets all supported MIME types
 * @returns Array of all supported MIME types
 */
export function getSupportedMimeTypes(): string[] {
  const mimeTypes: string[] = [];
  for (const mapping of Object.values(FILE_TYPE_MAPPINGS)) {
    mimeTypes.push(...mapping.mimeTypes);
  }
  return mimeTypes;
}

