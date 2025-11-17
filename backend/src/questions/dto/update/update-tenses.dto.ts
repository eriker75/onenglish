import { PartialType } from '@nestjs/swagger';
import { CreateTensesDto } from '../cretate/create-tenses.dto';

export class UpdateTensesDto extends PartialType(CreateTensesDto) {}
