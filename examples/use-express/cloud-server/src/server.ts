/**
 * ***************************
 * ***** クラウドサーバー *****
 * ***************************
 */

import Express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { 
  RepeatRequest, 
  RequestRepeatersController, 
  AlreadyConnectedException, 
} from '@yamadash82/request-repeater';

const repeatersController = new RequestRepeatersController();

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
  res.send('Hello world.');
});

app.post('/request-repeat', async (req, res) => {
  const body: RepeatRequest<any> = req.body;
  console.log(`着信データ:${JSON.stringify(body)}`);
  try {
    const resData = await repeatersController.send(body);

    return res.json(resData);
  } catch(err) {
    return res.json(err instanceof Error ? err.message : 'リクエスト中継処理でエラーが発生しました。');
  }
});

const httpServer = createServer(app);

const io = new Server(httpServer);

io.use((socket, next) => {
  if (!("organizationId" in socket.handshake.auth)) {
    return next(new Error('組織IDが設定されていない。'));
  }

  return next();
});

io.on('connection', (socket) => {
  try {
    repeatersController.add(socket);

    socket.on('disconnect', (reason) => {
      console.log(`${reason}`);

      repeatersController.remove(socket.handshake.auth.organizationId);
    });
  } catch (err) {
    if (err instanceof AlreadyConnectedException) {
      console.error(`${err.message}接続を維持します。`);
    } else {
      socket.disconnect();
      console.log(`サーバサイドでエラー補足:${err}`);
    }
  }
});

httpServer.listen(3000, () => {
  console.log(`cloud server running on port:3000.`);
});

export default app;