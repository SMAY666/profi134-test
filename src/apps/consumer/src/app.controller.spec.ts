import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

jest.mock('rxjs', () => {
  const actual = jest.requireActual('rxjs');
  return {
    ...actual,
    firstValueFrom: jest.fn(),
  };
});

describe('Consumer AppController', () => {
  let controller: AppController;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'NOTIFIER_SERVICE',
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    client = module.get<ClientProxy>('NOTIFIER_SERVICE');
  });

  it('should forward notification events to notifier', async () => {
    (firstValueFrom as jest.Mock).mockResolvedValue(undefined);

    const event = {
      type: 'notification',
      payload: { message: 'Hi' },
      createdAt: new Date().toISOString(),
    };

    await controller.handleEvent(event as any);

    expect(client.emit).toHaveBeenCalledWith(
      'notification',
      expect.objectContaining({
        message: 'Hi',
        createdAt: event.createdAt,
      }),
    );
  });

  it('should not call notifier for non-notification events', async () => {
    const event = {
      type: 'other',
      payload: { message: 'Hi' },
      createdAt: new Date().toISOString(),
    };

    await controller.handleEvent(event as any);

    expect(client.emit).not.toHaveBeenCalled();
  });

  it('should log error if emit fails', async () => {
    const error = new Error('Failed emit');
    (firstValueFrom as jest.Mock).mockRejectedValue(error);

    const logSpy = jest.spyOn(controller['logger'], 'error');

    const event = {
      type: 'notification',
      payload: { message: 'Hi' },
      createdAt: new Date().toISOString(),
    };

    await controller.handleEvent(event as any);

    expect(logSpy).toHaveBeenCalledWith(error);
  });
});
