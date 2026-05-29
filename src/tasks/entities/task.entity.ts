import { Transform } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'createdBy' })
  @Transform(({ value }: { value: User }) =>
    value ? { id: value.id, name: value.name, email: value.email } : null,
  )
  createdBy: User;
}
