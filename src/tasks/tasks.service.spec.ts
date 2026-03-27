import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should be added new task', () => {
    const dto: CreateTaskDto = {
      title: 'Task abcde',
      description: 'Description abcde',
    };

    const task = service.create(dto);
    expect(task).toBeDefined();
    expect(task.title).toBe(dto.title);
    expect(task.description).toBe(dto.description);
    expect(task.status).toBe('TODO');
    expect(task.isDeleted).toBe(false);

    expect(service.findAll()).toContain(task);
  });
});
