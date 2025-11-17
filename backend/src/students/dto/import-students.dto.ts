import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { ImportFileDto } from '../../common/dtos/import-file.dto';

export class ImportStudentsDto extends ImportFileDto {
  @ApiPropertyOptional({
    description:
      'School ID to assign to all imported students (required for admin uploads when the file omits a schoolId column)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  schoolId?: string;
}

