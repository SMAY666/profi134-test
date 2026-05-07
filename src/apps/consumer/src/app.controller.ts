import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { RabbitEventDto } from '../../../libs/interfaces';
import { firstValueFrom, retry } from 'rxjs';

@Controller()
export class AppController {
  constructor(@Inject('NOTIFIER_SERVICE') private client: ClientProxy) {}
  private readonly logger = new Logger(this.constructor.name);

  @EventPattern('new_event')
  async handleEvent(event: RabbitEventDto) {
    this.logger.log(`Received event: ${JSON.stringify(event)}`);
    if (event.type === 'notification') {
      try {
        await firstValueFrom(
          this.client.emit('notification', { ...event.payload }).pipe(
            retry({
              count: 3,
              delay: 1000,
            }),
          ),
        );
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
