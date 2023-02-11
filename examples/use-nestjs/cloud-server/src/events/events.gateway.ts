import { 
  WebSocketGateway,  
  OnGatewayConnection, 
  OnGatewayDisconnect, 
} from '@nestjs/websockets';
import { RequestRepeatersController, RepeatRequest } from '@yamadash82/request-repeater';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private repeatersController = new RequestRepeatersController();

  handleConnection(socket: Socket) {
    try {
      //中継器を追加する。
      this.repeatersController.add(socket);
      Logger.log(`${socket.handshake.auth.organizationId}が接続しました。`);
    } catch(err) {
      Logger.error(`RequestRepeaterインスタンス追加処理中にエラーが発生しました。`, `EventsGateway#handleConnection`);
    }
  }

  handleDisconnect(socket: Socket) {
    try {
      const organizationId = socket.handshake.auth.organizationId;
      this.repeatersController.remove(organizationId);
      Logger.log(`${organizationId}が切断しました。`);
    } catch(err) {
      Logger.error('RequestRepeaterインスタンス削除処理中にエラーが発生しました。', `EventsGateway#handleDisconnect`);
    }
  }

  //リクエスト中継処理
  async repeatRequest<RT>(request: RepeatRequest<any>): Promise<RT> {
    try {
      return this.repeatersController.send(request);
    } catch(err) {
      throw err;
    }
  }
}
