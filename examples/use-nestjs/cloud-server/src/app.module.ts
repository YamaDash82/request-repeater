import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { RepeatRequestModule } from './repeat-request/repeat-request.module';

@Module({
  imports: [EventsModule, RepeatRequestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
