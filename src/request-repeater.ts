import { Socket } from 'socket.io';
import { RepeatRequest } from './repeat-request';

//接続済例外
export class AlreadyConnectedException extends Error {
  constructor() {
    super();

    this.message = '既に接続済のRequestRepeaterです。';
  }  
}

export class RequestRepeater {
  //イベント名
  static repeatRequestEventName = 'repeat-request';
  public readonly organizationId: string;

  constructor (
    private socket: Socket
  ) { 
    if (!("organizationId" in this.socket.handshake.auth)) {
      throw new Error('SocketにorganizationIdパラメーターが存在しません。');
    }

    this.organizationId = this.socket.handshake.auth.organizationId;
    console.log(`RequestRepeater生成:${this.organizationId}`);
  }

  //リクエスト送信処理
  send(parameter: any): Promise<any> {
    const eventName = RequestRepeater.repeatRequestEventName;

    return new Promise((resolve, reject) => { 
      this.socket.emit(
        eventName, 
        parameter, 
        (err: any, res: any) => {
          if (err) return reject(err);

          return resolve(res);
        }
      );
    });
  }
}

export class RequestRepeatersController {
  private repeaters: RequestRepeater[] = [];

  constructor() { }

  find(organizationId: string): RequestRepeater | null {
    const found = this.repeaters.find(repeater => {
      return repeater.organizationId === organizationId;
    });

    return found || null;
  }

  add(socket: Socket): void;
  add(repeater: RequestRepeater): void;
  add(arg: Socket | RequestRepeater) {
    if (arg instanceof RequestRepeater) {
      const tempRepeater = arg;

      if (this.repeaters.find(rpt => rpt.organizationId === tempRepeater.organizationId)) {
        //既に接続済の接続要求があった時、接続済例外をスローする。
        throw new AlreadyConnectedException();
      }
  
      this.repeaters.push(tempRepeater);
      
    } else {
      console.log(`Socketから生成`);
      const socket = arg;

      if (!("organizationId" in socket.handshake.auth)) {
        throw new Error('SocketにorganizationIdパラメーターが存在しません。');
      }

      if (this.repeaters.find(repeater => repeater.organizationId === socket.handshake.auth.organizationId)) {
        //既に接続済の接続要求があった時、接続済例外をスローする。
        throw new AlreadyConnectedException();
      }

      this.repeaters.push(new RequestRepeater(socket))
    }
  }

  remove(organizationId: string) {
    //削除するソケットのindexを取得。
    const foundIndex = this.repeaters.findIndex(repeater => repeater.organizationId === organizationId);

    //削除対象のソケットが見つからなければ何もせずに終了する。
    if (foundIndex < 0) return;

    //該当のソケットを削除する。
    this.repeaters.splice(foundIndex, 1);
  }

  async send(
    parameter: RepeatRequest<any>
  ): Promise<any> {
    const foundRepeater = this.repeaters.find(repeater => repeater.organizationId === parameter.organizationId);

    if (!foundRepeater) throw new Error('対象のローカルサーバーが中継サーバーに接続されていません。');

    return await foundRepeater.send(parameter);
  }
}