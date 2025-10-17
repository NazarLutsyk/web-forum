import { User } from "../domain/user";
import { IUserRepository } from "../domain/repositories/IUserRepository";

export class ViewAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public execute(adminUser: User): User[] | undefined {
    if (adminUser.role !== "admin") {
      return undefined;
    }

    return this.userRepository.findAll();
  }
}
