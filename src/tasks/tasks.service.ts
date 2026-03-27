import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description for Task 1',
      status: 'TODO',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    },
  ];

  create(createTaskDto: CreateTaskDto) {
    const newTask = new Task(createTaskDto.title, createTaskDto.description, 1);
    this.tasks.push(newTask);
    return newTask;
  }

  findAll() {
    const tasks = this.tasks.filter((task) => !task.isDeleted);

    if (!tasks) {
      throw new NotFoundException();
    }

    return tasks;
  }

  findOne(id: number): Task | null {
    const task = this.tasks.find((task) => task.id === id && !task.isDeleted);

    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = this.findOne(id);

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
      return task;
    }
    return null;
  }

  remove(id: number) {
    const task = this.findOne(id);
    if (task) {
      task.isDeleted = true;
      return task;
    }
    return null;
  }
}
