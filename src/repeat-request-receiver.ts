import { io, Socket } from 'socket.io-client';
import { RepeatRequest } from './repeat-request';

export class RepeatRequestReceiver {
  static eventName = "repeat-request";

  private requestHandlers: AbstractRepeatRequestHandler<any, any>[] = [];
  
  constructor (
    public readonly socket: Socket 
  ) { 
    this.init();
  }

  private init() {
    this.socket.removeAllListeners();
    
    const tempEventName = RepeatRequestReceiver.eventName;
    
    this.socket.on(tempEventName, async (data: RepeatRequest<any>, callback: (err: any, res: any) => void) => {

      //対象のハンドラを検索する。
      const foundHandler = this.requestHandlers.find(handler => {
        console.log(`巡回中:${data.handlerId}, カレント:${handler.handlerId}`);
        return handler.handlerId === data.handlerId;
      });

      if (!foundHandler) throw new Error(`handlerIdで指定されたイベントハンドラーが見つかりませんでした。`);

      try {
        const res = await foundHandler.getResponse(data.parameter);

        return callback(null, res);
      } catch(err) {
        return callback(err, null);
      }
    });
  }

  setHandler(repeatRequest: AbstractRepeatRequestHandler<any, any>): void;
  setHandler(repeatRequests: AbstractRepeatRequestHandler<any, any>[]): void;
  setHandler(arg: any): void {
    if (Array.isArray(arg)) {
      this.requestHandlers.push(...arg);
    } else {
      this.requestHandlers.push(arg);
    }
    console.log(`handler.length:${this.requestHandlers.length}`);
  }
}

//抽象中継リクエストイベントハンドラー
//PT:パラメータ型
//RT:返却値型
export abstract class AbstractRepeatRequestHandler<PT, RT> {
  constructor (
    public readonly handlerId: string
  ) { }

  abstract getResponse(parameter: PT): RT | Promise<RT>;
  abstract getResponse(): RT | Promise<RT>;
  abstract getResponse(arg?: any): RT | Promise<RT>;
}