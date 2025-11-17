import { PartialType } from '@nestjs/swagger';
import { CreateLyricsTrainingDto } from '../cretate/create-lyrics-training.dto';

export class UpdateLyricsTrainingDto extends PartialType(
  CreateLyricsTrainingDto,
) {}
