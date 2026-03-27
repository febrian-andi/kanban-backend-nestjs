import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all should return empty tasks', async () => {
    jest.spyOn(service, 'findAll').mockImplementation(() => [] as Task[]);

    expect(await controller.findAll()).toEqual([]);
  });

  it('find all should return all tasks', async () => {
    const tasks: Task[] = [
      new Task('Task 1', 'Description 1', 1),
      new Task('Task 2', 'Description 2', 1),
    ];

    jest.spyOn(service, 'findAll').mockImplementation(() => tasks);

    expect(await controller.findAll()).toEqual(tasks);
  });

  it('find one should be return task', () => {
    const task: Task = new Task('Task 1', 'Description 1', 1);

    jest.spyOn(service, 'findOne').mockImplementation((id: number) => {
      expect(id).toEqual(task.id);
      return task;
    });

    const actual = controller.findOne(task.id);
    expect(actual).toBe(task);
  });

  it('find one should throw NotFoundException', () => {
    jest.spyOn(service, 'findOne').mockImplementation(() => {
      throw new NotFoundException();
    });

    expect(() => controller.findOne(10)).toThrow(NotFoundException);
  });
});
