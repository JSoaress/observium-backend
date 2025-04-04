export interface IMail {
    sendMail(to: string, subject: string, path: string, variables: Record<string, unknown>): Promise<void>;
}
