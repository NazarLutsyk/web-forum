import { User } from "../../domain/user";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  public findByLogin(login: string): User | undefined {
    return this.findAll().find((user) => user.login === login);
  }
}
