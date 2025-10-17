export class Topic {
  public views: number = 0;

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly authorId: string,
    public readonly createdAt: Date,
    public readonly tags: string[],
  ) {}

  public static fromJSON(json: any): Topic {
    const topic = new Topic(
      json.id,
      json.title,
      json.description,
      json.authorId,
      new Date(json.createdAt),
      json.tags,
    );
    topic.views = json.views;
    return topic;
  }

  public incrementViews(): void {
    this.views++;
  }
}
