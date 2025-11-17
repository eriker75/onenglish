export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

export enum SupportedMimeType {
  // Audio
  AUDIO_MP3 = 'audio/mpeg',
  AUDIO_WAV = 'audio/wav',
  AUDIO_OGG = 'audio/ogg',
  AUDIO_FLAC = 'audio/flac',
  AUDIO_M4A = 'audio/mp4',

  // Image
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_PNG = 'image/png',
  IMAGE_WEBP = 'image/webp',
  IMAGE_GIF = 'image/gif',

  // Video
  VIDEO_MP4 = 'video/mp4',
  VIDEO_WEBM = 'video/webm',
  VIDEO_MOV = 'video/quicktime',
}
