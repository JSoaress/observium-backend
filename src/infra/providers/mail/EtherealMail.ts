import nodemailer, { Transporter } from "nodemailer";

import { compileHTML } from "@/infra/libs/handlebars";

import { IMail } from "./IMail";

export class EtherealMail implements IMail {
    private client: Transporter | undefined;

    constructor() {
        nodemailer
            .createTestAccount()
            .then((account) => {
                const transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass,
                    },
                });
                this.client = transporter;
            })
            .catch((err) => console.error(err));
    }

    async sendMail(to: string, subject: string, path: string, variables: Record<string, unknown>): Promise<void> {
        const templateHTML = compileHTML(path, variables);
        const message = await this.client?.sendMail({
            to,
            from: `Admin <noreply@observium.com.br>`,
            subject,
            html: templateHTML,
        });
        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}
