import { Post } from "../post";

export interface IPostRepository {
  findAll(): Post[];
  findById(id: string): Post | undefined;
  findByTopicId(topicId: string): Post[];
  save(entity: Post): Post;
  update(entity: Post): Post | undefined;
  delete(id: string): boolean;
  load(data: Post[]): void;
}
