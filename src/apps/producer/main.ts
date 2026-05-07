import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from '../../libs/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Producer API').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(ENV.PORT);
}

void bootstrap();
