import { Module } from '@nestjs/common';
import { RepeatRequestController } from './repeat-request.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    EventsModule, 
  ], 
  controllers: [RepeatRequestController]
})
export class RepeatRequestModule {}
