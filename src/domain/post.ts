import { User } from "./user";

export class Post {
  public likes: number = 0;

  constructor(
    public readonly id: string,
    public readonly topicId: string,
    public readonly authorId: string,
    public content: string,
    public readonly createdAt: Date
  ) {}

  public static fromJSON(json: any): Post {
    const post = new Post(
      json.id,
      json.topicId,
      json.authorId,
      json.content,
      new Date(json.createdAt)
    );
    post.likes = json.likes;
    return post;
  }

  public incrementLikes(): void {
    this.likes++;
  }

  public updateContent(newContent: string, user: User): boolean {
    if (!user.canEditPost(this)) {
      return false;
    }
    this.content = newContent;
    return true;
  }
}
