import { Inject, Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PayloadDto } from '../../../libs/interfaces';
import { TelegramBotApi } from './telegramBotApi';


@Controller()
export class AppController {
  constructor(@Inject('TG_BOT') private tgBot: TelegramBotApi) {}
  private logger = new Logger(this.constructor.name);

  @EventPattern('notification')
  async handleEvent(payload: PayloadDto) {
    try {
      const msg = `Получено новое сообщение RebbitMQ: \n [Payload]: ${JSON.stringify(payload)}`;
      await this.tgBot.sendMessage(msg);
    } catch (err) {
      this.logger.error('Error during send telegram notification', err);
    }
  }
}
