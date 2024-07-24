import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from '../entities/task.entity';
import { FilterParams, SortParams } from './query-params.dto';

export type GetAllRequestQuery = SortParams & FilterParams;

export class GetAllResponseDto {
  @ApiProperty()
  tasks: TaskEntity[];
}
