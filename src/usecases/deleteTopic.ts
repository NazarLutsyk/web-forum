import { ITopicRepository } from "../domain/repositories/ITopicRepository";
import { IPostRepository } from "../domain/repositories/IPostRepository";
import { User } from "../domain/user";

export class DeleteTopicUseCase {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly postRepository: IPostRepository
  ) {}

  public execute(topicId: string, user: User): boolean {
    const topic = this.topicRepository.findById(topicId);
    if (!topic) {
      return false;
    }

    if (!user.canDeleteTopic(topic)) {
      return false;
    }

    const posts = this.postRepository.findByTopicId(topicId);
    posts.forEach((post) => this.postRepository.delete(post.id));

    return this.topicRepository.delete(topicId);
  }
}
