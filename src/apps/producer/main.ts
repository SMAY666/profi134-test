import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from '../../libs/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ENV.PORT);
}

void bootstrap();
