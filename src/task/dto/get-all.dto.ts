import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from '../entities/task.entity';

export class GetAllRequestDto {
  @ApiProperty()
  sortBy?: string;

  @ApiProperty()
  descending?: boolean;
}

export class GetAllResponseDto {
  @ApiProperty()
  tasks: TaskEntity[];
}
