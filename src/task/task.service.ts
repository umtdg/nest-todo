import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllRequestDto, GetAllResponseDto } from './dto/get-all.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>) {}

  create(dto: CreateTaskDto | Partial<TaskEntity>) {
    Logger.debug(`Creating task ${JSON.stringify(dto)}`);
    return this.taskRepository.save(dto);
  }

  async getAllByAssignee(assignee: string, dto: GetAllRequestDto): Promise<GetAllResponseDto> {
    const tasks = await this.taskRepository.find({
      where: { assigneeId: assignee },
      order: {
        [dto.sortBy]: dto.descending ? 'DESC' : 'ASC',
      },
    });

    return { tasks };
  }

  async getById(id: string, assignee: string): Promise<TaskEntity> {
    return this.checkAccess(id, assignee);
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return this.taskRepository.save({ id, ...updateTaskDto });
  }

  async remove(id: string, assignee: string): Promise<TaskEntity> {
    const task = await this.checkAccess(id, assignee);
    if (!task) {
      return null;
    }

    return this.taskRepository.remove(task);
  }

  private async checkAccess(id: string, assignee: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      Logger.warn(`User ${assignee} tried to access task ${id} that does not exist`);
      throw new BadRequestException('You are trying to access a task that does not exist');
    }

    if (task.assigneeId !== assignee) {
      Logger.warn(`User ${assignee} tried to access task ${id} that does not belong to them`);
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }
}
