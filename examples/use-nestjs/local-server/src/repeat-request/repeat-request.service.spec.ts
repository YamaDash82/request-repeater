import { Test, TestingModule } from '@nestjs/testing';
import { RepeatRequestService } from './repeat-request.service';

describe('RepeatRequestService', () => {
  let service: RepeatRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepeatRequestService],
    }).compile();

    service = module.get<RepeatRequestService>(RepeatRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
