import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';

describe('TasksService', () => {
  let service: TasksService;

  const mockTasksRepository = {
    createTask: jest.fn(),
    findAllTasks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should be added new task', async () => {
    const dto: CreateTaskDto = {
      title: 'Task abcde',
      description: 'Description abcde',
    };

    const createdTask = {
      id: 1,
      ...dto,
      status: 'TODO',
      isDeleted: false,
    };

    mockTasksRepository.createTask.mockResolvedValue(createdTask);

    const task = await service.create(dto);

    expect(task).toBeDefined();
    expect(task.title).toBe(dto.title);
    expect(task.description).toBe(dto.description);
    expect(task.status).toBe('TODO');
    expect(task.isDeleted).toBe(false);

    expect(mockTasksRepository.createTask).toHaveBeenCalledWith(dto);
  });
});
