import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  ArrayMinSize,
  Min,
  Max,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';

@ValidatorConstraint({ name: 'GridDimensionsMatch', async: false })
class GridDimensionsMatchConstraint implements ValidatorConstraintInterface {
  validate(content: string[][], args: ValidationArguments) {
    const object = args.object as CreateWordboxDto;
    const { gridWidth, gridHeight } = object;

    if (!content || !Array.isArray(content)) {
      return false;
    }

    // Si no tenemos gridWidth o gridHeight (caso de update parcial), omitir validación
    if (gridWidth === undefined || gridHeight === undefined) {
      return true;
    }

    // Validar que el grid tenga exactamente gridHeight filas
    if (content.length !== gridHeight) {
      return false;
    }

    // Validar que cada fila tenga exactamente gridWidth columnas
    return content.every(
      (row) => Array.isArray(row) && row.length === gridWidth,
    );
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateWordboxDto;
    const { gridWidth, gridHeight } = object;
    return `Grid content must match dimensions ${gridWidth}x${gridHeight}. Expected ${gridHeight} rows with ${gridWidth} columns each.`;
  }
}

export class CreateWordboxDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    example: 3,
    description: 'Width of the grid (number of columns)',
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1, { message: 'Grid width must be at least 1' })
  @Max(10, { message: 'Grid width cannot exceed 10' })
  @Type(() => Number)
  gridWidth: number;

  @ApiProperty({
    example: 3,
    description: 'Height of the grid (number of rows)',
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1, { message: 'Grid height must be at least 1' })
  @Max(10, { message: 'Grid height cannot exceed 10' })
  @Type(() => Number)
  gridHeight: number;

  @ApiProperty({
    example: 5,
    default: 5,
    description:
      'Maximum number of words the student needs to form to complete the challenge and advance to the next question',
    minimum: 1,
    maximum: 50,
  })
  @IsInt()
  @Min(1, { message: 'Max words must be at least 1' })
  @Max(50, { message: 'Max words cannot exceed 50' })
  @Type(() => Number)
  maxWords: number = 5;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    example: [
      ['A', 'B', 'C'],
      ['S', 'T', 'O'],
      ['A', 'C', 'D'],
    ],
    description:
      '2D array representing the letter grid. Must match gridWidth x gridHeight dimensions.',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Grid content cannot be empty' })
  @Validate(GridDimensionsMatchConstraint)
  content: string[][];
}
