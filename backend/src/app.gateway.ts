import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin:"*"
  }
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGteway')

  @SubscribeMessage('routeToOffice')
  handleRouteToOffice(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    return data
  }

  @SubscribeMessage('routeToLunch')
  handleRouteToLunch(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    return data
  }

  afterInit(server: Server) {
      this.logger.log('Init')
  }     

  handleConnection(client: Socket, ...args: any[]) {
      this.logger.log(`client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnected: ${client.id}`)
  }
}
