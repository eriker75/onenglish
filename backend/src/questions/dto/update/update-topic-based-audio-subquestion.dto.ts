import { PartialType } from '@nestjs/swagger';
import { CreateTopicBasedAudioSubquestionDto } from '../cretate/create-topic-based-audio-subquestion.dto';

export class UpdateTopicBasedAudioSubquestionDto extends PartialType(
  CreateTopicBasedAudioSubquestionDto,
) {}
