/// <reference types="jest" />

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

describe('Producer AppController', () => {
  let controller: AppController;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'RABBIT_SERVICE',
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    client = module.get<ClientProxy>('RABBIT_SERVICE');
  });

  it('should send event successfully', async () => {
    (firstValueFrom as jest.Mock).mockResolvedValue(undefined);

    const payload = { message: 'Hello' };
    const result = await controller.sendData(payload as any);

    expect(client.emit).toHaveBeenCalledWith(
      'new_event',
      expect.objectContaining({
        type: 'notification',
        payload,
      }),
    );
    expect(result).toHaveProperty('status', 'sent');
    expect(result).toHaveProperty('id');
  });

  it('should log error if emit fails', async () => {
    const error = new Error('Rabbit failed');
    (firstValueFrom as jest.Mock).mockRejectedValue(error);
    const payload = { message: 'Hello' };

    const logSpy = jest.spyOn(controller['logger'], 'error');

    const result = await controller.sendData(payload as any);

    expect(logSpy).toHaveBeenCalledWith(error);
    expect(result).toHaveProperty('status', 'sent'); // Возвращает id даже при ошибке
  });
});
