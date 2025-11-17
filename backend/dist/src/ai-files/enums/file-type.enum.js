"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedMimeType = exports.FileType = void 0;
var FileType;
(function (FileType) {
    FileType["AUDIO"] = "audio";
    FileType["IMAGE"] = "image";
    FileType["VIDEO"] = "video";
    FileType["DOCUMENT"] = "document";
})(FileType || (exports.FileType = FileType = {}));
var SupportedMimeType;
(function (SupportedMimeType) {
    SupportedMimeType["AUDIO_MP3"] = "audio/mpeg";
    SupportedMimeType["AUDIO_WAV"] = "audio/wav";
    SupportedMimeType["AUDIO_OGG"] = "audio/ogg";
    SupportedMimeType["AUDIO_FLAC"] = "audio/flac";
    SupportedMimeType["AUDIO_M4A"] = "audio/mp4";
    SupportedMimeType["IMAGE_JPEG"] = "image/jpeg";
    SupportedMimeType["IMAGE_PNG"] = "image/png";
    SupportedMimeType["IMAGE_WEBP"] = "image/webp";
    SupportedMimeType["IMAGE_GIF"] = "image/gif";
    SupportedMimeType["VIDEO_MP4"] = "video/mp4";
    SupportedMimeType["VIDEO_WEBM"] = "video/webm";
    SupportedMimeType["VIDEO_MOV"] = "video/quicktime";
})(SupportedMimeType || (exports.SupportedMimeType = SupportedMimeType = {}));
//# sourceMappingURL=file-type.enum.js.map