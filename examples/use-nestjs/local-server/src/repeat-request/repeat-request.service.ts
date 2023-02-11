import { Injectable, Logger } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { RepeatRequestReceiver, AbstractRepeatRequestHandler } from '@yamadash82/request-repeater';
import * as SuperAgent from 'superagent';

@Injectable()
export class RepeatRequestService {
  private requestReceiver!: RepeatRequestReceiver;
  
  //WebSockets接続
  async connect(): Promise<boolean> {
    try {
      const url = 'http://localhost:3000';
      
      const socket = io(url, {
        auth: {
          organizationId: 'organization001', 
          password: 'abc123'
        }
      });

      this.requestReceiver = new RepeatRequestReceiver(socket);

      socket.on('disconnect', reason => {
        Logger.log(`中継サーバーとの接続を解除しました。${reason}`, `RepeatRequestService#connect`);
      });

      await (async () => {
        return new Promise<boolean>((resolve, reject) => {
          //接続時
          socket.on('connect', () => {
            Logger.log('中継サーバーとの接続に成功しました。', `RepeatRequestService#connect`);
            return resolve(true);
          });

          //接続エラー時
          socket.on('connect_error', err => {
            return reject(err);
          })
        });
      })();

      this.setHandler();

      return true;
    } catch(err) {
      Logger.error(`中継サーバーとの接続処理中にエラーが発生しました。${err instanceof Error ? err.message : ''}`, `RepeatRequestService#connect`);
      
      return false;
    }
  }

  setHandler() {
    this.requestReceiver.setHandler(new RepeatGetRequestHander<any>('get-request'));
  }
}

class GetRequestParameter {
  url: string;
  parameter: any
}

export class RepeatGetRequestHander<RT> extends AbstractRepeatRequestHandler<GetRequestParameter, RT> {
  getResponse(parameter: GetRequestParameter): Promise<RT>;
  getResponse(): Promise<RT>;
  async getResponse(parameter?: any): Promise<RT> {
    Logger.log(`中継リクエストを受信しました。`, `RepeatGetRequestHandler#getResponse`);
    if (!parameter) throw new Error(`GetRequestParameter型のパラメーターが設定されていません。`);
    try {
      const url = parameter.url;
      const res = await SuperAgent(url).query(parameter.parameter);
      
      return res.text as RT;
    } catch(err) {
      throw err;
    }
  }
}