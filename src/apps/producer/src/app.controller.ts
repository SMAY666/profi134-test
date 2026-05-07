import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PayloadDto, RabbitEventDto } from '../../../libs/dto';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom, retry } from 'rxjs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(@Inject('RABBIT_SERVICE') private client: ClientProxy) {}
  private readonly logger = new Logger(this.constructor.name);

  @Post('event')
  @ApiOperation({ summary: 'Send data' })
  @ApiResponse({ status: 200, description: 'Message successfully sent' })
  async sendData(@Body() payload: PayloadDto) {
    const event: RabbitEventDto = {
      id: uuidv4(),
      type: 'notification',
      payload,
      createdAt: new Date(),
    };
    try {
      await firstValueFrom(
        this.client.emit('new_event', event).pipe(
          retry({
            count: 3,
            delay: 1000,
          }),
        ),
      );
    } catch (err) {
      this.logger.error(err);
    }
    this.logger.log(`Message with id: ${event.id} successfully sent`);
    return { status: 'sent', id: event.id };
  }
}
