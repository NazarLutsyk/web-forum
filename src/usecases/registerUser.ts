import { User } from "../domain/user";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import * as crypto from "crypto";

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public execute(login: string, password: string): User | undefined {
    const existingUser = this.userRepository.findByLogin(login);
    if (existingUser) {
      return undefined; // User already exists
    }

    const user = new User(
      crypto.randomUUID(),
      login,
      password,
      "user",
      false,
    );
    this.userRepository.save(user);
    return user;
  }
}
