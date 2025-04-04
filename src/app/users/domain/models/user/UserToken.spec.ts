import { beforeAll, describe, expect, test } from "vitest";

import { UUID } from "@/shared/helpers";

import { Password } from "./Password";
import { User } from "./User";
import { UserToken } from "./UserToken";

let user: User;

beforeAll(async () => {
    user = User.restore({
        id: "0195fe25-7685-7d66-9079-d8ed8a5608e0",
        name: "John Doe",
        email: "johndoe@observium.com",
        password: Password.restore("$2b$10$Uz..hCfhanYC1z.8SR9Y4Oy6ClrP49J4Ebyj1TgtNHGNQYM7ND0mu"),
        active: true,
    });
});

describe("domain entity user token", () => {
    test("should create a user token of type activation", () => {
        const userTokenOrError = UserToken.createActivation({ user });
        expect(userTokenOrError.isRight()).toBeTruthy();
        const userToken = userTokenOrError.value as UserToken;
        expect(UUID.validate(userToken.getId())).toBeTruthy();
        expect(userToken.userId).toBe("0195fe25-7685-7d66-9079-d8ed8a5608e0");
        expect(userToken.token).toBeDefined();
        expect(userToken.type).toBe("activation");
        expect(userToken.createdAt).instanceOf(Date);
        expect(userToken.isActivation()).toBeTruthy();
        expect(userToken.isResetPassword()).toBeFalsy();
    });

    test("should create a user token of type reset password", () => {
        const userTokenOrError = UserToken.createResetPassword({ user });
        expect(userTokenOrError.isRight()).toBeTruthy();
        const userToken = userTokenOrError.value as UserToken;
        expect(UUID.validate(userToken.getId())).toBeTruthy();
        expect(userToken.userId).toBe("0195fe25-7685-7d66-9079-d8ed8a5608e0");
        expect(userToken.token).toBeDefined();
        expect(userToken.type).toBe("reset-password");
        expect(userToken.createdAt).instanceOf(Date);
        expect(userToken.isActivation()).toBeFalsy();
        expect(userToken.isResetPassword()).toBeTruthy();
    });
});
