import { PartialType } from '@nestjs/swagger';
import { CreateFastTestDto } from '../cretate/create-fast-test.dto';

export class UpdateFastTestDto extends PartialType(CreateFastTestDto) {}
