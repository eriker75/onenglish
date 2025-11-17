import { PartialType } from '@nestjs/swagger';
import { CreateTellMeAboutItDto } from '../cretate/create-tell-me-about-it.dto';

export class UpdateTellMeAboutItDto extends PartialType(
  CreateTellMeAboutItDto,
) {}
