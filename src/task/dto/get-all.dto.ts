import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from '../entities/task.entity';

export class GetAllResponseDto {
  @ApiProperty()
  tasks: TaskEntity[];
}
