import { PartialType } from '@nestjs/swagger';
import { CreateTalesDto } from '../cretate/create-tales.dto';

export class UpdateTalesDto extends PartialType(CreateTalesDto) {}
