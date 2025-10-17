import { Topic } from "../domain/topic";
import { ITopicRepository } from "../domain/repositories/ITopicRepository";
import { User } from "../domain/user";
import * as crypto from "crypto";

export class CreateTopicUseCase {
  constructor(private readonly topicRepository: ITopicRepository) {}

  public execute(
    title: string,
    description: string,
    author: User,
    tags: string[],
  ): Topic {
    const topic = new Topic(
      crypto.randomUUID(),
      title,
      description,
      author.id,
      new Date(),
      tags,
    );
    this.topicRepository.save(topic);
    return topic;
  }
}
