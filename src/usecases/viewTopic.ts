import { Topic } from "../domain/topic";
import { Post } from "../domain/post";
import { ITopicRepository } from "../domain/repositories/ITopicRepository";
import { IPostRepository } from "../domain/repositories/IPostRepository";

export class ViewTopicUseCase {
  constructor(
    private readonly topicRepository: ITopicRepository,
    private readonly postRepository: IPostRepository
  ) {}

  public execute(topicId: string): { topic: Topic; posts: Post[] } | null {
    const topic = this.topicRepository.findById(topicId);
    if (!topic) {
      return null;
    }

    topic.incrementViews();
    this.topicRepository.update(topic);

    const posts = this.postRepository.findByTopicId(topicId);
    return { topic, posts };
  }
}
