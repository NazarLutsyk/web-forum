import { Post } from "../domain/post";
import { IPostRepository } from "../domain/repositories/IPostRepository";

export class LikePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  public execute(postId: string): Post | null {
    const post = this.postRepository.findById(postId);
    if (!post) {
      return null;
    }

    post.incrementLikes();
    this.postRepository.update(post);
    return post;
  }
}
