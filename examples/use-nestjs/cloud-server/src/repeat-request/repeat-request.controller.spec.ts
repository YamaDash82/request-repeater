import { Test, TestingModule } from '@nestjs/testing';
import { RepeatRequestController } from './repeat-request.controller';

describe('RepeatRequestController', () => {
  let controller: RepeatRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepeatRequestController],
    }).compile();

    controller = module.get<RepeatRequestController>(RepeatRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
