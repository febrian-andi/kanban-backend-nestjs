import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { AuthRequest } from 'src/core/request/auth';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Version('1')
  @Post()
  async create(@Req() req: AuthRequest, @Body() createTaskDto: CreateTaskDto) {
    const newTask = await this.tasksService.create(
      createTaskDto,
      req.authenticatedUser.userId,
    );
    return newTask;
  }

  @Version('1')
  @Get()
  async findAll(@Req() req: AuthRequest) {
    // await new Promise((resolve) => setTimeout(resolve, 4000));

    const tasks = await this.tasksService.findAll(req.authenticatedUser.userId);

    if (tasks.length < 1) {
      return tasks;
    }

    return tasks;
  }

  @Version('1')
  @Get(':id')
  async findOne(@Req() req: AuthRequest, @Param('id') id: number) {
    const task = await this.tasksService.findOne(
      req.authenticatedUser.userId,
      id,
    );
    return task;
  }

  @Version('1')
  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.update(
      req.authenticatedUser.userId,
      id,
      updateTaskDto,
    );
    return task;
  }

  @Version('1')
  @Delete(':id')
  async remove(@Req() req: AuthRequest, @Param('id') id: number) {
    const task = await this.tasksService.remove(
      req.authenticatedUser.userId,
      id,
    );
    return task;
  }
}
