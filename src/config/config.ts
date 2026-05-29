import * as process from 'node:process';
import { Algorithm } from 'jsonwebtoken';
import type { StringValue } from 'ms';

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  synchronize: boolean;
};

export type JwtConfig = {
  algorithm: Algorithm;
  issuer: string;
  audience: string;
  secret: string;
  expiresIn: StringValue;
};

type EnvMode = 'development' | 'staging' | 'release' | 'production';

export type AppConfig = {
  env: EnvMode;
  port: number;
};

type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
};

export default (): Config => {
  const nodeEnv: EnvMode = (process.env.NODE_ENV ?? 'development') as EnvMode;
  return {
    app: {
      env: nodeEnv,
      port: parseInt(process.env.PORT ?? '3000'),
    },
    database: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      name: process.env.DB_NAME ?? 'kanban',
      synchronize: !['production', 'release'].includes(nodeEnv),
    },
    jwt: {
      algorithm: (process.env.JWT_ALGORITHM ?? 'HS256') as Algorithm,
      issuer: process.env.JWT_ISSUER ?? 'kanban',
      audience: process.env.JWT_AUDIENCE ?? 'kanban',
      secret: process.env.JWT_SECRET ?? 'secret28',
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '12h') as StringValue,
    },
  };
};
