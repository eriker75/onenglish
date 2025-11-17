"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFileTypeByExtension = detectFileTypeByExtension;
exports.detectFileTypeByMimeType = detectFileTypeByMimeType;
exports.detectFileType = detectFileType;
exports.isFileTypeSupported = isFileTypeSupported;
exports.getSupportedExtensions = getSupportedExtensions;
exports.getSupportedMimeTypes = getSupportedMimeTypes;
const FILE_TYPE_MAPPINGS = {
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
function detectFileTypeByExtension(filename) {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    for (const [type, mapping] of Object.entries(FILE_TYPE_MAPPINGS)) {
        if (mapping.extensions.includes(extension)) {
            return type;
        }
    }
    return null;
}
function detectFileTypeByMimeType(mimeType) {
    for (const [type, mapping] of Object.entries(FILE_TYPE_MAPPINGS)) {
        if (mapping.mimeTypes.includes(mimeType)) {
            return type;
        }
    }
    return null;
}
function detectFileType(filename, mimeType) {
    const typeFromMime = detectFileTypeByMimeType(mimeType);
    if (typeFromMime) {
        return typeFromMime;
    }
    const typeFromExtension = detectFileTypeByExtension(filename);
    if (typeFromExtension) {
        return typeFromExtension;
    }
    throw new Error(`Unsupported file type. Filename: ${filename}, MIME type: ${mimeType}`);
}
function isFileTypeSupported(filename, mimeType) {
    try {
        detectFileType(filename, mimeType);
        return true;
    }
    catch {
        return false;
    }
}
function getSupportedExtensions() {
    const extensions = [];
    for (const mapping of Object.values(FILE_TYPE_MAPPINGS)) {
        extensions.push(...mapping.extensions);
    }
    return extensions;
}
function getSupportedMimeTypes() {
    const mimeTypes = [];
    for (const mapping of Object.values(FILE_TYPE_MAPPINGS)) {
        mimeTypes.push(...mapping.mimeTypes);
    }
    return mimeTypes;
}
//# sourceMappingURL=file-type-detector.util.js.map