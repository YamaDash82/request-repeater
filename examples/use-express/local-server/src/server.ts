/**
 * ****************************
 * ***** ローカルサーバー ******
 * ****************************
 */

import Express from 'express';
import { io, Socket } from 'socket.io-client';
import { RepeatRequestReceiver, AbstractRepeatRequestHandler } from '@yamadash82/request-repeater';
import SuperAgent  from 'superagent';

class GetRequestParameter {
  url!: string;
  parameter!: any
}

export class RepeatGetRequestHandler<RT> extends AbstractRepeatRequestHandler<GetRequestParameter, RT> {
  getResponse(parameter: GetRequestParameter): RT | Promise<RT>;
  getResponse(): RT | Promise<RT>;
  async getResponse(parameter?: any): Promise<RT> {
    console.log(`イベント着信`);
    if (!parameter) throw new Error('GetRequestParameter型のパラメータが設定されていません。');
    
    try {
      const url: string = parameter.url;

      const res = await SuperAgent(url).query(parameter.parameter);
      
      return res.text as RT;
    } catch(err) {
      throw err;
    }
  }
}

const app = Express();
let requestReciever: RepeatRequestReceiver;
let socket: Socket;

app.get('/connect', async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  try {
    socket = io('http://localhost:3000', {
      auth: {
        organizationId: 'organization001'
      }
    });

    await (async () => {
      return new Promise<boolean>((resolve, reject) => {
        socket.on('connect', () => {
          console.log(`接続成功`);
          return resolve(true);
        });
    
        socket.on('connect_error', (err) => {
          console.log(`接続失敗:${err}`);
          socket.disconnect();
          return reject(err);
        });
      })      
    })();

    setTimeout(() => {
      socket.on('disconnect', () => {
        console.log('切断');
      });
    });

    requestReciever = new RepeatRequestReceiver(socket);

    requestReciever.setHandler(new RepeatGetRequestHandler<any>('get-request'));

    res.send('中継サーバーに接続');
  } catch(err) {
    res.send('中継サーバーに接続中にエラーが発生しました。' + (err instanceof Error ? err.message : ''));
  }
});

app.get('/socket-status', (req, res) => {
  res.send(socket.connected);  
});

app.get('/fetch-users-list', (req, res) => {
  const users: { userId: number, userName: string }[] = [
    { userId: 1, userName: '山田　太郎' }, 
    { userId: 2, userName: '山田　二朗' }, 
    { userId: 3, userName: '山田　花子' }
  ];

  return res.json(users);
});

app.listen(8080, () => {
  console.log(`local server running on port:8080.`);
});

export default app;