import { Module } from '@nestjs/common';
import { RepeatRequestService } from './repeat-request.service';
import { RepeatRequestController } from './repeat-request.controller';

@Module({
  providers: [RepeatRequestService],
  controllers: [RepeatRequestController]
})
export class RepeatRequestModule {}
