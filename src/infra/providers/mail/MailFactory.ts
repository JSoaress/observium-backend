import { MissingDependencyError } from "@/infra/errors";

import { EtherealMail } from "./EtherealMail";
import { IMail } from "./IMail";
import { NodemailerMail } from "./NodemailerMail";

export class MailFactory {
    static getMail(provider: string): IMail {
        switch (provider) {
            case "ethereal":
                return new EtherealMail();
            case "nodemailer":
                return new NodemailerMail();
            default:
                throw new MissingDependencyError("IMail");
        }
    }
}
