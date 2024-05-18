import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";

import {
    Socket,
    Server,
} from 'socket.io';

@WebSocketGateway(3002, {})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleDisconnect(client: any) {
        console.log('user disconnect: ', client.id);
        client.broadcast.emit('user-disconnect', {
            message: `user disconnect ${client.id}`,
        });
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('user connected: ', client.id);
        client.broadcast.emit('user-connect', {
            message: `user connect ${client.id}`,
        });
    }

    @SubscribeMessage('newMessage')
    handleNewMessage(client: Socket, message: any) {
        this.server.emit('message', message);
    }
}