import { randomUUID } from "node:crypto";
import { v7 as uuidv7, validate } from "uuid";

export class UUID {
    static v4() {
        return randomUUID();
    }

    static v7() {
        return uuidv7();
    }

    static validate(uuid: string) {
        return validate(uuid);
    }
}
