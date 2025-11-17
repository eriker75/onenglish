import { PartialType } from '@nestjs/swagger';
import { CreateWordMatchDto } from '../cretate/create-word-match.dto';

export class UpdateWordMatchDto extends PartialType(CreateWordMatchDto) {}
