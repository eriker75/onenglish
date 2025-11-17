import { PartialType } from '@nestjs/swagger';
import { CreateReadItDto } from '../cretate/create-read-it.dto';

export class UpdateReadItDto extends PartialType(CreateReadItDto) {}
