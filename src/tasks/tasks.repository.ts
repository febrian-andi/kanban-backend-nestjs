import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: number,
  ): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: 'TODO',
      createdBy: { id: userId } as User,
    });
    return await this.taskRepository.save(task);
  }

  async getTasks(userId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: ['createdBy'],
      where: {
        isDeleted: false,
        createdBy: { id: userId } as User,
      },
    });
  }

  async getTaskById(id: number): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: ['createdBy'],
    });
  }

  async saveTask(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }
}
