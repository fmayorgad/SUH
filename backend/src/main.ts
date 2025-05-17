import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { APP } from './config';
import { AppModule } from './app.module';

import {
  globalHttpExceptionFilter,
  globalJsonWebTokenExceptionFilter,
  globalTypeORMExceptionFilter,
  globalTypeErrorFilter,
} from '@filters/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalFilters(
    globalHttpExceptionFilter,
    globalJsonWebTokenExceptionFilter,
    globalTypeORMExceptionFilter,
    globalTypeErrorFilter,
  );
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle(`${APP.name}`.toUpperCase())
    .setDescription(`${APP.description}`)
    .setVersion(APP.version)
    .addBearerAuth()
    .build();

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${APP.name}/apiDoc`, app, document);

  await app.listen(APP.port, () => {
    Logger.log(`app running at http://localhost:${APP.port}`);
    Logger.log(`docs: http://localhost:${APP.port}/${APP.name}/apidoc`);
  });
}
bootstrap();
