import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepeatRequestModule } from './repeat-request/repeat-request.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RepeatRequestModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
