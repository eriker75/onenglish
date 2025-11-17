import { PartialType } from '@nestjs/swagger';
import { CreateGossipDto } from '../cretate/create-gossip.dto';

export class UpdateGossipDto extends PartialType(CreateGossipDto) {}
