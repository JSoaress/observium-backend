import nodemailer, { Transporter } from "nodemailer";

import { compileHTML } from "@/infra/libs/handlebars";
import { env } from "@/shared/config/environment";

import { IMail } from "./IMail";

export class NodemailerMail implements IMail {
    private client: Transporter;

    constructor() {
        this.client = nodemailer.createTransport({
            host: env.mailHost,
            port: env.mailPort,
            secure: env.mailPort === 465,
            auth: {
                user: env.mailUser,
                pass: env.mailPass,
            },
        });
    }

    async sendMail(to: string, subject: string, path: string, variables: Record<string, unknown>): Promise<void> {
        const templateHTML = compileHTML(path, variables);
        await this.client.sendMail({
            to,
            from: `Admin <${env.mailUser}>`,
            subject,
            html: templateHTML,
        });
    }
}
