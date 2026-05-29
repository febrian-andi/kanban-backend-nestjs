import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  VersioningType,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages:
        configService.get<string>('IS_PRODUCTION') === 'true', //for production
    }),
  );

  const port = configService.get<number>('APP_PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
