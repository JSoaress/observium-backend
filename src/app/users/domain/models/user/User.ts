import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Model } from "@/app/_common";
import { InvalidPasswordError, PasswordDoNotMatchError, ValidationError } from "@/app/_common/errors";
import { ZodValidator } from "@/infra/libs/zod";

import { Password } from "./Password";
import { CreateUserDTO, RestoreUserDTO, UserDTO, UserSchema } from "./UserDTO";

export class User extends Model<UserDTO> {
    private constructor(props: UserDTO) {
        super(props);
    }

    static async create(props: CreateUserDTO): Promise<Either<ValidationError | InvalidPasswordError, User>> {
        const validDataOrError = ZodValidator.validate(props, UserSchema);
        if (!validDataOrError.success) return left(new ValidationError(User.name, validDataOrError.errors));
        const passwordOrError = await Password.create(props.password);
        if (passwordOrError.isLeft()) return left(passwordOrError.value);
        return right(new User({ ...validDataOrError.data, password: passwordOrError.value }));
    }

    static restore(props: RestoreUserDTO) {
        return new User(props);
    }

    get name() {
        return this.props.name;
    }

    get email() {
        return this.props.email;
    }

    get password() {
        return this.props.password.getValue();
    }

    get active() {
        return this.props.active;
    }

    async verifyPassword(plainPassword: string): Promise<boolean> {
        return this.props.password.verify(plainPassword);
    }

    async setPassword(
        newPassword: string,
        currentPassword?: string
    ): Promise<Either<InvalidPasswordError | PasswordDoNotMatchError, void>> {
        if (currentPassword) {
            const matchPassword = await this.verifyPassword(currentPassword);
            if (!matchPassword) return left(new PasswordDoNotMatchError());
        }
        const passwordOrError = await Password.create(newPassword);
        if (passwordOrError.isLeft()) return left(passwordOrError.value);
        this.props.password = passwordOrError.value;
        return right(undefined);
    }

    activate() {
        this.props.active = true;
    }
}
