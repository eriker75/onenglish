import { ApiProperty } from '@nestjs/swagger';
import { Challenge as PrismaChallenge } from '@prisma/client';

export class Challenge implements PrismaChallenge {
  @ApiProperty({ description: 'Challenge ID' })
  id: string;

  @ApiProperty({ description: 'Challenge title' })
  title: string;

  @ApiProperty({ description: 'Challenge slug (unique)' })
  slug: string;

  @ApiProperty({ description: 'Challenge description', required: false, nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'Challenge category',
    enum: ['listening', 'speaking', 'grammar', 'vocabulary', 'mixed'],
  })
  category: string;

  @ApiProperty({
    description: 'Challenge level',
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  })
  level: string;

  @ApiProperty({
    description: 'Challenge difficulty',
    enum: ['easy', 'medium', 'hard'],
  })
  difficulty: string;

  @ApiProperty({ description: 'Total points for the challenge' })
  totalPoints: number;

  @ApiProperty({ description: 'Whether the challenge is published' })
  isPublished: boolean;

  @ApiProperty({ description: 'Whether the challenge is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
