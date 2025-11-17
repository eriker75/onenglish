import { PartialType } from '@nestjs/swagger';
import { CreateUnscrambleDto } from '../cretate/create-unscramble.dto';

export class UpdateUnscrambleDto extends PartialType(CreateUnscrambleDto) {}
