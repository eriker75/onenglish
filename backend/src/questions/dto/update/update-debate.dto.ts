import { PartialType } from '@nestjs/swagger';
import { CreateDebateDto } from '../cretate/create-debate.dto';

export class UpdateDebateDto extends PartialType(CreateDebateDto) {}
