import { IUserRepository } from "../domain/repositories/IUserRepository";
import { User } from "../domain/user";

export class BlockUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public execute(userId: string, adminUser: User): User | undefined {
    if (adminUser.role !== "admin") {
      return undefined;
    }

    const userToBlock = this.userRepository.findById(userId);
    if (!userToBlock) {
      return undefined;
    }

    userToBlock.block();
    this.userRepository.update(userToBlock);
    return userToBlock;
  }
}
