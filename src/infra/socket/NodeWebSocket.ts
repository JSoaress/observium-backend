import { WebSocket, WebSocketServer } from "ws";

import { IWebSocket, SendMessageClientWebSocket } from "./IWebSocket";

export class NodeWebSocket implements IWebSocket {
    private wss: WebSocketServer;
    private clients = new Set<WebSocket>();

    constructor() {
        this.wss = new WebSocketServer({ port: 8081, path: "/ws/messages" });
        this.wss.on("connection", (ws) => {
            this.clients.add(ws);
            ws.on("close", () => {
                this.clients.delete(ws);
            });
        });
        console.info("Web Socket server running on port 8081");
    }

    send(message: SendMessageClientWebSocket): void {
        this.clients.forEach((ws) => {
            if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(message));
        });
    }

    close(): void {
        throw new Error("Method not implemented.");
    }
}
