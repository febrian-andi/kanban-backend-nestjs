import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Version('1')
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    const newTask = this.tasksService.create(createTaskDto);
    return {
      message: 'Task created successfully',
      task: newTask,
    };
  }

  @Version('1')
  @Get()
  findAll() {
    const tasks = this.tasksService.findAll();

    if (tasks.length < 1) {
      return {
        message: 'Tasks is empty',
        tasks: tasks,
      };
    }

    return {
      message: 'Tasks retrieved successfully',
      tasks: tasks,
    };
  }

  @Version('1')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const task = this.tasksService.findOne(id);
    return {
      message: `Task with ID ${id} retrieved successfully`,
      task: task,
    };
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = this.tasksService.update(id, updateTaskDto);
    return {
      message: `Task with ID ${id} updated successfully`,
      task: task,
    };
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const task = this.tasksService.remove(id);
    return {
      message: `Task with ID ${id} removed successfully`,
      task: task,
    };
  }
}
