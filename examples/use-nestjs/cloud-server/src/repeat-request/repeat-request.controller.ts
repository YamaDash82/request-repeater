import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { RepeatRequest } from '@yamadash82/request-repeater';

@Controller('request-repeat')
export class RepeatRequestController {
  constructor (
    private events: EventsGateway
  ) { }

  @Post() 
  async repeatRequest(@Body() repeatRequest: RepeatRequest<any>): Promise<RepeatResponse<any>> {
    Logger.log(`中継リクエストを受信しました。 organizationId:${repeatRequest.organizationId}, handlerId:${repeatRequest.handlerId}`);

    try {
      return new RepeatResponse(
        true, 
        '', 
        await this.events.repeatRequest(repeatRequest)
      );
    } catch(err) {
      return new RepeatResponse(
        false, 
        `中継サーバーで中継リクエスト中にエラーが発生しました。${err instanceof Error ? err.message : ''}`, 
        null
      );
    }
  }
}

//中継レスポンス
export class RepeatResponse<RT> {
  constructor (
    readonly succeed: boolean, 
    readonly errorMessage: string, 
    readonly body: RT | null
  ) { }
}