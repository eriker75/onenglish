import { PartialType } from '@nestjs/swagger';
import { CreateImageToMultipleChoicesDto } from '../cretate/create-image-to-multiple-choices.dto';

export class UpdateImageToMultipleChoicesDto extends PartialType(
  CreateImageToMultipleChoicesDto,
) {}
