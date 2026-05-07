import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ENV } from '../../../libs/env';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramBotApi implements OnModuleInit {
  private readonly bot = new TelegramBot(ENV.BOT_TOKEN, { polling: true });
  private readonly logger = new Logger(this.constructor.name);
  private chatId: number | null = null;

  private registerHandlers() {
    this.bot.on('message', (msg) => {
      if (!this.chatId) {
        this.chatId = msg.chat.id;
      }
    });
  }
  public async sendMessage(msg: string) {
    if (!this.chatId) {
      this.logger.error(`Sending message failed: chatId is not specified`);
      throw new Error('ChatId is not specified');
    }
    await this.bot.sendMessage(this.chatId?.toString(), msg);
  }

  onModuleInit(): any {
    this.registerHandlers();
  }
}
