import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({
    description: 'Unique ID of the file in the database',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  })
  id: string;

  @ApiProperty({
    description: 'URL of the uploaded/updated file',
    example: '/uploads/image/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8.png',
  })
  url: string;

  @ApiProperty({
    description: 'Random filename generated for the file',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8.png',
  })
  filename: string;

  @ApiProperty({
    description: 'Detected file type',
    example: 'image',
    enum: ['image', 'voice', 'document', 'video'],
  })
  type: string;
}

export class DeleteFileResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'File deleted successfully',
  })
  message: string;
}
