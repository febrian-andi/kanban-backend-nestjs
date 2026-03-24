import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly tasksService: TasksService) { }

  @Version('1')
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    const newTask = this.tasksService.create(createTaskDto);
    return newTask;
  }

  @Version('1')
  @Get()
  async findAll() {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const tasks = this.tasksService.findAll();

    if (tasks.length < 1) {
      return tasks;
    }

    return tasks;
  }

  @Version('1')
  @Get(':id')
  findOne(@Param('id') id: number) {
    const task = this.tasksService.findOne(id);
    return task;
  }

  @Version('1')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    const task = this.tasksService.update(id, updateTaskDto);
    return task;
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id') id: number) {
    const task = this.tasksService.remove(id);
    return task;
  }
}
