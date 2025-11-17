import { ApiProperty } from '@nestjs/swagger';

export class Challenge {
  @ApiProperty({ description: 'Challenge ID' })
  id: string;

  @ApiProperty({ description: 'Challenge name' })
  name: string;

  @ApiProperty({
    description: 'Grade level',
    enum: [
      '5th_grade',
      '6th_grade',
      '1st_year',
      '2nd_year',
      '3rd_year',
      '4th_year',
      '5th_year',
    ],
  })
  grade: string;

  @ApiProperty({
    description: 'Challenge type',
    enum: ['regular', 'bilingual'],
  })
  type: string;

  @ApiProperty({ description: 'Whether the challenge is a demo' })
  isDemo: boolean;

  @ApiProperty({
    description: 'Year of the challenge',
    required: false,
    nullable: true,
  })
  year: number | null;

  @ApiProperty({
    description: 'Exact date of the challenge',
    required: false,
    nullable: true,
  })
  exactDate: Date | null;

  @ApiProperty({
    description: 'Challenge stage',
    enum: ['Regional', 'State', 'National'],
    required: false,
    nullable: true,
  })
  stage: string | null;

  @ApiProperty({ description: 'Whether the challenge is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  // Computed fields (not in database)
  @ApiProperty({ description: 'Total number of questions (computed)' })
  totalQuestions?: number;

  @ApiProperty({ description: 'Total time in minutes (computed)' })
  totalTime?: number;
}
