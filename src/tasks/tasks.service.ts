import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return await this.tasksRepository.createTask(createTaskDto, userId);
  }

  async findAll(userId: number): Promise<Task[]> {
    return await this.tasksRepository.getTasks(userId);
  }

  async findOne(userId: number, id: number): Promise<Task> {
    const task = await this.tasksRepository.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    if (task.createdBy.id !== userId) {
      throw new ForbiddenException(
        `You do not have permission to access this task`,
      );
    }

    return task;
  }

  async update(
    userId: number,
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(userId, id);

    if (updateTaskDto.status) {
      task.status = updateTaskDto.status;
    }
    if (updateTaskDto.title) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description) {
      task.description = updateTaskDto.description;
    }
    task.updatedAt = new Date();

    return await this.tasksRepository.saveTask(task);
  }

  async remove(userId: number, id: number): Promise<Task> {
    const task = await this.findOne(userId, id);
    task.isDeleted = true;
    return await this.tasksRepository.saveTask(task);
  }
}
