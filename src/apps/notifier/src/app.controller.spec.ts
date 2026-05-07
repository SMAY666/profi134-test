import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('Notifier AppController', () => {
  let controller: AppController;
  const mockTgBot = { sendMessage: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'TG_BOT',
          useValue: mockTgBot,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should send message via Telegram bot', async () => {
    mockTgBot.sendMessage.mockResolvedValue(undefined);

    const payload = { message: 'Hello', createdAt: '2026-05-07T12:00:00Z' };

    await controller.handleEvent(payload as any);

    expect(mockTgBot.sendMessage).toHaveBeenCalledWith(
      expect.stringContaining('"message":"Hello"'),
    );
  });

  it('should log error if Telegram fails', async () => {
    const error = new Error('TG fail');
    mockTgBot.sendMessage.mockRejectedValue(error);
    const logSpy = jest.spyOn(controller['logger'], 'error');

    const payload = { message: 'Hello', createdAt: '2026-05-07T12:00:00Z' };
    await controller.handleEvent(payload as any);

    expect(logSpy).toHaveBeenCalledWith(
      'Error during send telegram notification',
      error,
    );
  });
});
