import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/auth/auth.interface';
import { ReqUser } from 'src/auth/decorators/req-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetAllRequestDto, GetAllResponseDto } from './dto/get-all.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { QueryFailedErrorFilter } from './filters/query-failed-error.filter';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseFilters(new QueryFailedErrorFilter())
  @ApiResponse({ type: TaskEntity })
  async create(@ReqUser() user: Payload, @Body() dto: CreateTaskDto): Promise<TaskEntity> {
    Logger.debug(`Received create task request from user '${user.sub}'`);
    const task = await this.taskService.create({ ...dto, assigneeId: user.sub });
    Logger.log(`Created task '${task.id}' by user '${user.sub}'`);
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAll(@ReqUser() user: Payload, @Query() dto: GetAllRequestDto): Promise<GetAllResponseDto> {
    return this.taskService.getAllByAssignee(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@ReqUser() user: Payload, @Param('id') id: string): Promise<TaskEntity> {
    return this.taskService.getById(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@ReqUser() user: Payload, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    await this.taskService.getById(id, user.sub);

    return this.taskService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@ReqUser() user: Payload, @Param('id') id: string) {
    await this.taskService.getById(id, user.sub);

    return this.taskService.remove(id, user.sub);
  }
}
