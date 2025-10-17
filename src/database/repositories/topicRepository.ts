import { Topic } from "../../domain/topic";
import { ITopicRepository } from "../../domain/repositories/ITopicRepository";
import { BaseRepository } from "./baseRepository";

export class TopicRepository extends BaseRepository<Topic> implements ITopicRepository {
  public findByTags(tags: string[]): Topic[] {
    return this.findAll().filter((topic) =>
      tags.every((tag) => topic.tags.includes(tag))
    );
  }
}
