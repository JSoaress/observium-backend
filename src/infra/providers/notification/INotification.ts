export interface INotification {
    notify(to: string[], subject: string, msg: string): Promise<void>;
}
