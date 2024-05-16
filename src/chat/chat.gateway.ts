import { UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { User, UserDocument } from 'src/users/models/_user.model';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { WebsocketsExceptionFilter } from './filters/WebsocketsException.filter';
import * as os from 'os';
import { UserRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from 'src/auth/interfaces/tokenPayload.interface';

const roomName = (
  city: string,
  district_start: string,
  district_end: string,
): string => `${city} from ${district_start} to ${district_end}`;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway  {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly UsersRepostary: UserRepository,
  ) {
    // const cdc = this.UsersRepostary.watch([], { fullDocument: 'updateLookup' }); /// most important the second params

    // cdc.on('change', (event) => {
    //   if (event.operationType === 'update') {
    //     console.log('event updating');
    //     this.server
    //       .to(
    //         roomName(
    //           event.fullDocument.city,
    //           event.fullDocument.district_start,
    //           event.fullDocument.district_end,
    //         ),
    //       )
    //       .emit('location updated', event.fullDocument);
    //   }
    // });
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(
      'connected from : ',
      os.hostname(),
      ` as ${client.handshake.headers.authorization}`,
    );

    if (!client.handshake.headers.authorization) {
      console.log('no token provided');
      client.disconnect();
      return;
    }

    const user: UserDocument | false =
      await this.authService.verifyUserByTokenFromSocket(
        client.handshake.headers.authorization.split(' ')[1],
      );
    //testing



  }


  @UseGuards(WsJwtGuard)
  @UseFilters(new WebsocketsExceptionFilter())
  @SubscribeMessage('test-listen')
  async testListen(@MessageBody() data: any, @AuthUser() me: any) {
    // console.log(data, me.role);
    // throw new WsException('test exception event'); // Nest will handle the thrown exception and emit the exception message
    this.server.to(`${data.to}`).emit('test-emit', {
      msg: data,
      host: os.hostname(),
      sender: me,
    });
    return data;
  }
}