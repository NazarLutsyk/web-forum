import { User } from "../domain/user";
import { IUserRepository } from "../domain/repositories/IUserRepository";

export class LoginUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public execute(login: string, password: string): User | undefined {
    const user = this.userRepository.findByLogin(login);
    if (!user || user.password !== password || user.isBlocked) {
      return undefined;
    }
    return user;
  }
}
