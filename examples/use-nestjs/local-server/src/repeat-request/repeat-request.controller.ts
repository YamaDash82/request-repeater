import { Controller, Get, Logger } from '@nestjs/common';
import { RepeatRequestService } from './repeat-request.service';

@Controller('repeat-request')
export class RepeatRequestController {
  constructor (
    private service: RepeatRequestService
  ) { }

  @Get('connect')
  async connect(): Promise<boolean> {
    try {
      return await this.service.connect();
    } catch(err) {
      //中継サーバーとの接続エラー エラーメッセージはサービスのconnectメソッドで出力している。
      return false;
    }
  }
}
