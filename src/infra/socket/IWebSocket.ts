export type SendMessageClientWebSocket<TData = Record<string, unknown>> = {
    event: "registered-log";
    data: TData;
};

export interface IWebSocket {
    send(message: SendMessageClientWebSocket): void;
    close(): void;
}
