import { Post } from "../../domain/post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { BaseRepository } from "./baseRepository";

export class PostRepository extends BaseRepository<Post> implements IPostRepository {
  public findByTopicId(topicId: string): Post[] {
    return this.findAll()
      .filter((post) => post.topicId === topicId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}
