import { PartialType } from '@nestjs/swagger';
import { CreateWordboxDto } from '../cretate/create-wordbox.dto';

export class UpdateWordboxDto extends PartialType(CreateWordboxDto) {}
