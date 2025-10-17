import { IPostRepository } from "../domain/repositories/IPostRepository";
import { User } from "../domain/user";

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  public execute(postId: string, user: User): boolean {
    const post = this.postRepository.findById(postId);
    if (!post) {
      return false;
    }

    if (!user.canDeletePost(post)) {
      return false;
    }

    return this.postRepository.delete(postId);
  }
}
