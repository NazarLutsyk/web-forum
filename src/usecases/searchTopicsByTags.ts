import { Topic } from "../domain/topic";
import { ITopicRepository } from "../domain/repositories/ITopicRepository";

export class SearchTopicsByTagsUseCase {
  constructor(private readonly topicRepository: ITopicRepository) {}

  public execute(tags: string[]): Topic[] {
    return this.topicRepository.findByTags(tags);
  }
}
