import { describe, expect, test } from "vitest";

import { InvalidPasswordError, ValidationError } from "@/app/_common/errors";
import { UUID } from "@/shared/helpers";

import { Password } from "./Password";
import { User } from "./User";
import { CreateUserDTO } from "./UserDTO";

describe("domain entity user", () => {
    test("should create a user", async () => {
        const props: CreateUserDTO = {
            name: "John Doe",
            email: "JOHNDOE@observium.com", // parse to lowercase
            password: "123456",
        };
        const userOrError = await User.create(props);
        expect(userOrError.isRight()).toBeTruthy();
        const user = userOrError.value as User;
        expect(UUID.validate(user.getId())).toBeTruthy();
        expect(user.name).toBe("John Doe");
        expect(user.email).toBe("johndoe@observium.com");
        expect(user.password.startsWith("$2b$10")).toBeTruthy();
        expect(user.active).toBeFalsy();
    });

    test("should not create a user with invalid properties", async () => {
        const props: CreateUserDTO = {
            name: "",
            email: "johndoeobservium.com",
            password: "1234",
        };
        const userOrError = await User.create(props);
        expect(userOrError.isLeft()).toBeTruthy();
        const validationError = userOrError.value as ValidationError;
        expect(validationError.getError("name")).toEqual(["Esse campo não pode ficar em branco."]);
        expect(validationError.getError("email")).toEqual(["Informe um email válido."]);
    });

    test("should not create a user with invalid properties (name higher than 30 chars)", async () => {
        const props: CreateUserDTO = {
            name: "John Doeeeeeeeeeeeeeeeeeeeeeeee",
            email: "johndoe@observium.com",
            password: "123456",
        };
        const userOrError = await User.create(props);
        expect(userOrError.isLeft()).toBeTruthy();
        const validationError = userOrError.value as ValidationError;
        expect(validationError.getError("name")).toEqual(["Comprimento máximo para o campo: 30 caracteres"]);
    });

    test("should not create a user with invalid password", async () => {
        const props: CreateUserDTO = {
            name: "John Doe",
            email: "johndoe@observium.com",
            password: "",
        };
        const userOrError = await User.create(props);
        expect(userOrError.isLeft()).toBeTruthy();
        expect(userOrError.value).toEqual(new InvalidPasswordError("A senha não foi fornecida."));
    });

    test("should validate a user password", async () => {
        const user = User.restore({
            id: -1,
            name: "John Doe",
            email: "johndoe@observium.com",
            password: Password.restore("$2b$10$Uz..hCfhanYC1z.8SR9Y4Oy6ClrP49J4Ebyj1TgtNHGNQYM7ND0mu"),
            active: true,
        });
        const matchPassword = await user.verifyPassword("123456");
        expect(matchPassword).toBeTruthy();
    });

    test("should change a user password", async () => {
        const user = User.restore({
            id: -1,
            name: "John Doe",
            email: "johndoe@observium.com",
            password: Password.restore("$2b$10$Uz..hCfhanYC1z.8SR9Y4Oy6ClrP49J4Ebyj1TgtNHGNQYM7ND0mu"),
            active: true,
        });
        const setPasswordOrError = await user.setPassword("654321");
        expect(setPasswordOrError.isRight()).toBeTruthy();
        const matchPassword = await user.verifyPassword("654321");
        expect(matchPassword).toBeTruthy();
    });

    test("should not change a user password if new password are invalid", async () => {
        const user = User.restore({
            id: -1,
            name: "John Doe",
            email: "johndoe@observium.com",
            password: Password.restore("$2b$10$Uz..hCfhanYC1z.8SR9Y4Oy6ClrP49J4Ebyj1TgtNHGNQYM7ND0mu"),
            active: true,
        });
        const setPasswordOrError = await user.setPassword("");
        expect(setPasswordOrError.isLeft()).toBeTruthy();
        expect(setPasswordOrError.value).toEqual(new InvalidPasswordError("A senha não foi fornecida."));
    });
});
