import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  VersioningType,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfig>('app');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: appConfig.env === 'production',
    }),
  );

  await app.listen(appConfig.port);
}
void bootstrap();
