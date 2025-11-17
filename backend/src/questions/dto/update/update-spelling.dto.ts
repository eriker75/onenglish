import { PartialType } from '@nestjs/swagger';
import { CreateSpellingDto } from '../cretate/create-spelling.dto';

export class UpdateSpellingDto extends PartialType(CreateSpellingDto) {}
