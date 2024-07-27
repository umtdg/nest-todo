import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { FilterOptions, filterOptionToTypeOrm } from './decorators/filter-params.decorator';
import { PaginationOptions } from './decorators/pagination-params.decorator';
import { SortOptions, sortOptionsToTypeOrm } from './decorators/sort-params.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllResponseDto } from './dto/get-all.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>) {}

  create(dto: CreateTaskDto | Partial<TaskEntity>) {
    Logger.debug(`Creating task ${JSON.stringify(dto)}`);
    return this.taskRepository.save(dto);
  }

  async getAllByAssignee(
    assignee: string,
    sort: SortOptions,
    filter: FilterOptions[],
    pagination: PaginationOptions,
  ): Promise<GetAllResponseDto> {
    let findOpts: FindManyOptions = {
      where: { assigneeId: assignee },
      order: {},
    };

    for (const filterOpt of filter) {
      findOpts.where = {
        ...findOpts.where,
        ...filterOptionToTypeOrm(filterOpt),
      };
    }

    if (sort) findOpts.order = sortOptionsToTypeOrm(sort);

    if (pagination) {
      findOpts.skip = pagination.skip;
      findOpts.take = pagination.limit;
    }

    const tasks = await this.taskRepository.find(findOpts);

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
