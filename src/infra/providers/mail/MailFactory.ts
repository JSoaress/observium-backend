import { MissingDependencyError } from "@/infra/errors";

import { EtherealMail } from "./EtherealMail";
import { IMail } from "./IMail";

export class MailFactory {
    static getMail(provider: string): IMail {
        switch (provider) {
            case "ethereal":
                return new EtherealMail();
            default:
                throw new MissingDependencyError("IMail");
        }
    }
}
