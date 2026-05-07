import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ENV } from '../../libs/env';
import { notificationsQueue } from '../../constants/queues';
import { AppController } from './src/app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFIER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [ENV.RMQ_URL],
          queue: notificationsQueue,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
