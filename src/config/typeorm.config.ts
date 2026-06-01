import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'kanban',
  entities: [User, Task],
  migrations: ['dist/migrations/*.js'],
  ssl: ['production', 'release'].includes(process.env.NODE_ENV || 'development')
    ? { rejectUnauthorized: false }
    : false,
});
