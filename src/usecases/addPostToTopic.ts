import { Post } from "../domain/post";
import { IPostRepository } from "../domain/repositories/IPostRepository";
import { User } from "../domain/user";
import { Topic } from "../domain/topic";
import * as crypto from "crypto";

export class AddPostToTopicUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  public execute(content: string, author: User, topic: Topic): Post {
    const post = new Post(
      crypto.randomUUID(),
      topic.id,
      author.id,
      content,
      new Date(),
    );
    this.postRepository.save(post);
    return post;
  }
}
