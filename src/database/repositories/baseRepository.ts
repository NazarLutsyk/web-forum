import { randomUUID } from "crypto";

export abstract class BaseRepository<T extends { id: string }> {
  protected data: Map<string, T> = new Map();

  public findAll(): T[] {
    return Array.from(this.data.values());
  }

  public findById(id: string): T | undefined {
    return this.data.get(id);
  }

  public save(entity: T): T {
    this.data.set(entity.id, entity);
    return entity;
  }

  public update(entity: T): T | undefined {
    if (!this.data.has(entity.id)) {
      return undefined;
    }
    this.data.set(entity.id, entity);
    return entity;
  }

  public delete(id: string): boolean {
    return this.data.delete(id);
  }

  public load(data: T[]): void {
    this.data = new Map(data.map((item) => [item.id, item]));
  }
}
