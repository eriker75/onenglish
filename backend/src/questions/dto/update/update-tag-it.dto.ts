import { PartialType } from '@nestjs/swagger';
import { CreateTagItDto } from '../cretate/create-tag-it.dto';

export class UpdateTagItDto extends PartialType(CreateTagItDto) {}
