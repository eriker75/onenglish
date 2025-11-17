import { PartialType } from '@nestjs/swagger';
import { CreateSentenceMakerDto } from '../cretate/create-sentence-maker.dto';

export class UpdateSentenceMakerDto extends PartialType(
  CreateSentenceMakerDto,
) {}
