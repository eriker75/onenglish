import { PartialType } from '@nestjs/swagger';
import { CreateWordAssociationsDto } from '../cretate/create-word-associations.dto';

export class UpdateWordAssociationsDto extends PartialType(
  CreateWordAssociationsDto,
) {}
