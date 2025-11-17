import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AiTestRequestDto {
  @ApiProperty({
    description: 'Prompt message that will be used to test the AI query flow',
    example: 'Explain the present perfect tense in simple terms.',
  })
  @IsString()
  @IsNotEmpty()
  prompt!: string;
}

export class AiTestResponseDto {
  @ApiProperty({
    description: 'Original prompt received in the request',
    example: 'Explain the present perfect tense in simple terms.',
  })
  prompt!: string;

  @ApiProperty({
    description:
      'Mocked AI response that demonstrates the structure of a successful AI query',
    example: 'Present perfect describes actions that started in the past...',
  })
  response!: string;
}
