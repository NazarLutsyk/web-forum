import { Topic } from "../topic";

export interface ITopicRepository {
  findAll(): Topic[];
  findById(id: string): Topic | undefined;
  findByTags(tags: string[]): Topic[];
  save(entity: Topic): Topic;
  update(entity: Topic): Topic | undefined;
  delete(id: string): boolean;
  load(data: Topic[]): void;
}
