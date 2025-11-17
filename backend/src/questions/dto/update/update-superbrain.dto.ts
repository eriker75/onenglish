import { PartialType } from '@nestjs/swagger';
import { CreateSuperbrainDto } from '../cretate/create-superbrain.dto';

export class UpdateSuperbrainDto extends PartialType(CreateSuperbrainDto) {}
