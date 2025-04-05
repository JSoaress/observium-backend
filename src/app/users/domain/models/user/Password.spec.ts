import { describe, expect, test } from "vitest";

import { InvalidPasswordError } from "@/app/_common/errors";

import { Password } from "./Password";

describe("value object password", () => {
    test("should encrypt a password", async () => {
        const plainPassword = "0b5erv!umm";
        const passwordOrError = await Password.create(plainPassword);
        expect(passwordOrError.isRight()).toBeTruthy();
        const password = passwordOrError.value as Password;
        expect(password.getValue().startsWith("$2b$12$")).toBeTruthy();
        expect(password.getValue()).not.toBe(plainPassword);
    });

    test("should not encrypt a invalid password (empty password)", async () => {
        const plainPassword = "";
        const passwordOrError = await Password.create(plainPassword);
        expect(passwordOrError.isLeft()).toBeTruthy();
        expect(passwordOrError.value).toEqual(new InvalidPasswordError("A senha não foi fornecida."));
    });

    test("should validate a encrypted password", async () => {
        const password = Password.restore("$2b$12$.5E64r47mdQ5aS5QPF8LvORVZgTiHXZ8rX1fk07vsa7nZf9B0kPSK");
        const matchPassword = await password.verify("0b5erv!umm");
        expect(matchPassword).toBeTruthy();
    });

    test("should not validate a encrypted password (different passwords)", async () => {
        const password = Password.restore("$2b$12$.5E64r47mdQ5aS5QPF8LvORVZgTiHXZ8rX1fk07vsa7nZf9B0kPSK");
        const matchPassword = await password.verify("0b5erv!um");
        expect(matchPassword).toBeFalsy();
    });
});
