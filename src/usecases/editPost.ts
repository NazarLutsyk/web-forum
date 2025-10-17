import { Post } from "../domain/post";
import { IPostRepository } from "../domain/repositories/IPostRepository";
import { User } from "../domain/user";

export class EditPostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  public execute(
    postId: string,
    newContent: string,
    user: User
  ): Post | null {
    const post = this.postRepository.findById(postId);
    if (!post) {
      return null;
    }

    const updated = post.updateContent(newContent, user);
    if (!updated) {
      return null;
    }

    this.postRepository.update(post);
    return post;
  }
}
