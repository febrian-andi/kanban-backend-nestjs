export const TASK_STATUSES = [
  'TODO',
  'ON_PROGRESS',
  'DONE',
  'ARCHIVED',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export class Task {
  id!: number;
  title!: string;
  description!: string;
  status!: TaskStatus;
  createdBy!: number;
  createdAt!: Date;
  updatedAt!: Date;
  isDeleted!: boolean;

  constructor(title: string, description: string, createdBy: number) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.status = 'TODO';
    this.createdBy = createdBy;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isDeleted = false;
  }
}
