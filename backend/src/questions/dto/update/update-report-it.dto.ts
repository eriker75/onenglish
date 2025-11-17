import { PartialType } from '@nestjs/swagger';
import { CreateReportItDto } from '../cretate/create-report-it.dto';

export class UpdateReportItDto extends PartialType(CreateReportItDto) {}
