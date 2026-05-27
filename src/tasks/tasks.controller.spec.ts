import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        { provide: TasksService, useValue: mockTasksService },
      ],
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
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve([] as Task[]));

    expect(await controller.findAll()).toEqual([]);
  });

  it('find all should return all tasks', async () => {
    const tasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'TODO',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: 'TODO',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    ];

    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(tasks));

    expect(await controller.findAll()).toEqual(tasks);
  });

  it('find one should be return task', async () => {
    const task: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      status: 'TODO',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    jest.spyOn(service, 'findOne').mockImplementation((id: number) => {
      expect(id).toEqual(task.id);
      return Promise.resolve(task);
    });

    const actual = await controller.findOne(task.id);
    expect(actual).toBe(task);
  });

  it('find one should throw NotFoundException', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

    await expect(controller.findOne(10)).rejects.toThrow(NotFoundException);
  });
});
