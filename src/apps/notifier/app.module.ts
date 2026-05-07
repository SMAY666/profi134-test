import { Module } from '@nestjs/common';

import { TelegramBotApi } from './src/telegramBotApi';
import { AppController } from './src/app.controller';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: 'TG_BOT',
      useClass: TelegramBotApi,
    },
  ],
})
export class AppModule {}
