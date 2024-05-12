import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  connectedUsers: { [userId: number]: Socket[] } = {};

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const userId = getUserIdFromConnection(client);
    if (!userId) {
      return;
    }
    this.connectedUsers[userId] = (this.connectedUsers[userId] || []).concat(
      client,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userIdsToRemove = Object.keys(this.connectedUsers).filter(
      (userId) => {
        const sockets = this.connectedUsers[userId];
        const matchingSocketIndex = sockets.findIndex(
          (socket) => socket.id === client.id,
        );
        if (matchingSocketIndex !== -1) {
          sockets.splice(matchingSocketIndex, 1);
          return sockets.length === 0;
        }
        return false;
      },
    );

    userIdsToRemove.forEach((userId) => {
      delete this.connectedUsers[userId];
    });
  }

  notifyNewNotification(userIds: any) {
    userIds.forEach((userId) => {
      const sockets = this.connectedUsers[userId];
      if (sockets) {
        sockets.forEach((socket) => socket.emit('newNotification'));
      }
    });
  }
}

function getUserIdFromConnection(client: Socket): number | null {
  const userId = parseInt(client.handshake.query.userId as string);
  return userId;
}
