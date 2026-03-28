import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksRepository.createTask(createTaskDto);
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.getTasks();
  }

  async findOne(id: number): Promise<Task> {
    return await this.tasksRepository.getTaskById(id);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    return await this.tasksRepository.updateTask(id, updateTaskDto);
  }

  async remove(id: number): Promise<Task | null> {
    return await this.tasksRepository.deleteTask(id);
  }
}
