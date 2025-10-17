import { Post } from "./post";
import { Topic } from "./topic";

export type UserRole = "user" | "admin";

export class User {
  constructor(
    public readonly id: string,
    public readonly login: string,
    public readonly password: string,
    public readonly role: UserRole = "user",
    public isBlocked: boolean = false
  ) {}

  public static fromJSON(json: any): User {
    return new User(
      json.id,
      json.login,
      json.password,
      json.role,
      json.isBlocked
    );
  }

  public block(): void {
    this.isBlocked = true;
  }

  public canDeletePost(post: Post): boolean {
    return post.authorId === this.id || this.role === "admin";
  }

  public canDeleteTopic(topic: Topic): boolean {
    return this.role === "admin";
  }

  public canEditPost(post: Post): boolean {
    return post.authorId === this.id;
  }
}
