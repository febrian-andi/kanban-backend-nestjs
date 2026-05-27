import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const TASK_STATUSES = [
  'TODO',
  'ON_PROGRESS',
  'DONE',
  'ARCHIVED',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'varchar', length: 255 })
  description: string;
  @Column({ type: 'enum', enum: TASK_STATUSES })
  status: TaskStatus;
  @Column({ type: 'bigint' })
  createdBy: number;
  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
