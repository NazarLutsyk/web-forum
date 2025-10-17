import { Topic } from "../domain/topic";
import { ITopicRepository } from "../domain/repositories/ITopicRepository";

export class ViewAllTopicsUseCase {
  constructor(private readonly topicRepository: ITopicRepository) {}

  public execute(): Topic[] {
    return this.topicRepository.findAll();
  }
}
