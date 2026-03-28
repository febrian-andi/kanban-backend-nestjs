import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: 'TODO',
      createdBy: 1, // hardcoded as it was in the original service
    });
    return await this.taskRepository.save(task);
  }

  async getTasks(): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { isDeleted: false },
    });
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    const task = await this.getTaskById(id);

    if (task) {
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
      return await this.taskRepository.save(task);
    }
    return null;
  }

  async deleteTask(id: number): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (task) {
      task.isDeleted = true;
      return await this.taskRepository.save(task);
    }
    return null;
  }
}
