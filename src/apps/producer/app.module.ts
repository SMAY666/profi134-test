import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ENV } from '../../libs/env';
import { AppController } from './src/app.controller';
import { mainQueue } from '../../constants/queues';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [ENV.RMQ_URL],
          queue: mainQueue,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
