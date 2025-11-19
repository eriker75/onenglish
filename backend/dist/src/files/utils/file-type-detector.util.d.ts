export type FileType = 'image' | 'audio' | 'document' | 'video';
export declare function detectFileTypeByExtension(filename: string): FileType | null;
export declare function detectFileTypeByMimeType(mimeType: string): FileType | null;
export declare function detectFileType(filename: string, mimeType: string): FileType;
export declare function isFileTypeSupported(filename: string, mimeType: string): boolean;
export declare function getSupportedExtensions(): string[];
export declare function getSupportedMimeTypes(): string[];
