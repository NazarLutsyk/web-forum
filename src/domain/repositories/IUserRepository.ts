import { User } from "../user";

export interface IUserRepository {
  findAll(): User[];
  findById(id: string): User | undefined;
  findByLogin(login: string): User | undefined;
  save(entity: User): User;
  update(entity: User): User | undefined;
  delete(id: string): boolean;
  load(data: User[]): void;
}
