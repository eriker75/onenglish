import { PartialType } from '@nestjs/swagger';
import { CreateTopicBasedAudioDto } from '../cretate/create-topic-based-audio.dto';

export class UpdateTopicBasedAudioDto extends PartialType(
  CreateTopicBasedAudioDto,
) {}
