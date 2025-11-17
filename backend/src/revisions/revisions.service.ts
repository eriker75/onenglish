import { Injectable } from '@nestjs/common';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';

@Injectable()
export class RevisionsService {
  create(createRevisionDto: CreateRevisionDto) {
    return 'This action adds a new revision';
  }

  findAll() {
    return `This action returns all revisions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} revision`;
  }

  update(id: number, updateRevisionDto: UpdateRevisionDto) {
    return `This action updates a #${id} revision`;
  }

  remove(id: number) {
    return `This action removes a #${id} revision`;
  }
}
