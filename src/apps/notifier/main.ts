import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ENV } from '../../libs/env';
import { notificationsQueue } from '../../constants/queues';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [ENV.RMQ_URL],
      queue: notificationsQueue,
      queueOptions: { durable: true },
    },
  });
  await app.listen();
}
void bootstrap();
