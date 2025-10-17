import * as readline from "readline";
import { User } from "./domain/user";
import { RegisterUserUseCase } from "./usecases/registerUser";
import { LoginUserUseCase } from "./usecases/loginUser";
import { CreateTopicUseCase } from "./usecases/createTopic";
import { ViewAllTopicsUseCase } from "./usecases/viewAllTopics";
import { ViewTopicUseCase } from "./usecases/viewTopic";
import { AddPostToTopicUseCase } from "./usecases/addPostToTopic";
import { EditPostUseCase } from "./usecases/editPost";
import { DeletePostUseCase } from "./usecases/deletePost";
import { SearchTopicsByTagsUseCase } from "./usecases/searchTopicsByTags";
import { LikePostUseCase } from "./usecases/likePost";
import { DeleteTopicUseCase } from "./usecases/deleteTopic";
import { BlockUserUseCase } from "./usecases/blockUser";
import { ViewAllUsersUseCase } from "./usecases/viewAllUsers";
import { IUserRepository } from "./domain/repositories/IUserRepository";
import { ITopicRepository } from "./domain/repositories/ITopicRepository";
import { IPostRepository } from "./domain/repositories/IPostRepository";

export class Cli {
  private currentUser: User | null = null;
  private readonly rl: readline.Interface;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly topicRepository: ITopicRepository,
    private readonly postRepository: IPostRepository,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly createTopicUseCase: CreateTopicUseCase,
    private readonly viewAllTopicsUseCase: ViewAllTopicsUseCase,
    private readonly viewTopicUseCase: ViewTopicUseCase,
    private readonly addPostToTopicUseCase: AddPostToTopicUseCase,
    private readonly editPostUseCase: EditPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly searchTopicsByTagsUseCase: SearchTopicsByTagsUseCase,
    private readonly likePostUseCase: LikePostUseCase,
    private readonly deleteTopicUseCase: DeleteTopicUseCase,
    private readonly blockUserUseCase: BlockUserUseCase,
    private readonly viewAllUsersUseCase: ViewAllUsersUseCase,
  ) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  public async start() {
    console.log("Welcome to the Web Forum CLI!");
    try {
      while (true) {
        if (!this.currentUser) {
          await this.authMenu();
        } else {
          await this.forumMenu();
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      this.rl.close();
      process.exit(1);
    }
  }

  private async authMenu() {
    console.log("\n1. Register");
    console.log("2. Login");
    console.log("3. Exit");
    const choice = await this.prompt("Choose an option: ");

    switch (choice) {
      case "1":
        await this.register();
        break;
      case "2":
        await this.login();
        break;
      case "3":
        this.rl.close();
        process.exit(0);
      default:
        console.log("Invalid option");
    }
  }

  private async register() {
    const login = await this.prompt("Login: ");
    const password = await this.prompt("Password: ");
    const user = this.registerUserUseCase.execute(login, password);
    if (user) {
      console.log("Registration successful");
    } else {
      console.log("User already exists");
    }
  }

  private async login() {
    const login = await this.prompt("Login: ");
    const password = await this.prompt("Password: ");
    const user = this.loginUserUseCase.execute(login, password);
    if (user) {
      this.currentUser = user;
      console.log(`Welcome, ${this.currentUser.login}`);
    } else {
      console.log("Invalid credentials or user is blocked");
    }
  }

  private async forumMenu() {
    console.log(`\nLogged in as: ${this.currentUser!.login}`);
    console.log("1. View all topics");
    console.log("2. Create new topic");
    console.log("3. View specific topic");
    console.log("4. Search topics by tags");
    console.log("5. Logout");
    if (this.currentUser?.role === "admin") {
      console.log("6. Block user");
      console.log("7. Delete topic");
      console.log("8. View all users");
    }

    const choice = await this.prompt("Choose an option: ");

    switch (choice) {
      case "1":
        await this.viewAllTopics();
        break;
      case "2":
        await this.createTopic();
        break;
      case "3":
        await this.viewTopic();
        break;
      case "4":
        await this.searchTopics();
        break;
      case "5":
        this.currentUser = null;
        console.log("Logged out");
        break;
      case "6":
        if (this.currentUser?.role === "admin") {
          await this.blockUser();
        }
        break;
      case "7":
        if (this.currentUser?.role === "admin") {
          await this.deleteTopic();
        }
        break;
      case "8":
        if (this.currentUser?.role === "admin") {
          await this.viewAllUsers();
        }
        break;
      default:
        console.log("Invalid option");
    }
  }

  private async viewAllTopics() {
    const topics = this.viewAllTopicsUseCase.execute();
    if (topics.length === 0) {
      console.log("No topics found.");
      return;
    }
    topics.forEach((topic) => {
      console.log(`[${topic.id}] ${topic.title} (views: ${topic.views})`);
    });
  }

  private async createTopic() {
    const title = await this.prompt("Title: ");
    const description = await this.prompt("Description: ");
    const tagsStr = await this.prompt("Tags (comma-separated): ");
    const tags = tagsStr.split(",").map((tag) => tag.trim());
    const topic = this.createTopicUseCase.execute(
      title,
      description,
      this.currentUser!,
      tags,
    );
    console.log(`Topic "${topic.title}" created`);
  }

  private async viewTopic() {
    const topicId = await this.prompt("Enter topic ID: ");
    const result = this.viewTopicUseCase.execute(topicId);

    if (!result) {
      console.log("Topic not found.");
      return;
    }

    const { topic, posts } = result;
    console.log(`\n--- ${topic.title} ---`);
    console.log(topic.description);
    console.log(`Tags: ${topic.tags.join(", ")} | Views: ${topic.views}`);

    console.log("\n--- Posts ---");
    if (posts.length === 0) {
      console.log("No posts in this topic yet.");
    } else {
      posts.forEach((post) => {
        const author = this.userRepository.findById(post.authorId);
        console.log(
          `[${post.id}] ${author?.login || "Unknown"}: ${post.content} (Likes: ${post.likes})
        `,
        );
      });
    }

    await this.topicInteractionMenu(topic.id);
  }

  private async topicInteractionMenu(topicId: string) {
    console.log("\n1. Add a message");
    console.log("2. Edit a message");
    console.log("3. Delete a message");
    console.log("4. Like a message");
    console.log("5. Back to main menu");

    const choice = await this.prompt("Choose an option: ");

    switch (choice) {
      case "1":
        await this.addPost(topicId);
        break;
      case "2":
        await this.editPost();
        break;
      case "3":
        await this.deletePost();
        break;
      case "4":
        await this.likePost();
        break;
      case "5":
        return;
      default:
        console.log("Invalid option");
    }
  }

  private async addPost(topicId: string) {
    const content = await this.prompt("Your message: ");
    const topic = this.topicRepository.findById(topicId);
    if (topic) {
      this.addPostToTopicUseCase.execute(content, this.currentUser!, topic);
      console.log("Message posted.");
    }
  }

  private async editPost() {
    const postId = await this.prompt("Enter post ID to edit: ");
    const newContent = await this.prompt("Enter new content: ");
    const post = this.editPostUseCase.execute(
      postId,
      newContent,
      this.currentUser!,
    );
    if (post) {
      console.log("Post updated.");
    } else {
      console.log("Post not found or you do not have permission to edit it.");
    }
  }

  private async deletePost() {
    const postId = await this.prompt("Enter post ID to delete: ");
    const success = this.deletePostUseCase.execute(postId, this.currentUser!);
    if (success) {
      console.log("Post deleted.");
    } else {
      console.log("Post not found or you do not have permission to delete it.");
    }
  }

  private async likePost() {
    const postId = await this.prompt("Enter post ID to like: ");
    const post = this.likePostUseCase.execute(postId);
    if (post) {
      console.log("Post liked!");
    } else {
      console.log("Post not found.");
    }
  }

  private async searchTopics() {
    const tagsStr = await this.prompt(
      "Enter tags to search for (comma-separated): ",
    );
    const tags = tagsStr.split(",").map((tag) => tag.trim());
    const topics = this.searchTopicsByTagsUseCase.execute(tags);

    if (topics.length === 0) {
      console.log("No topics found with these tags.");
      return;
    }

    topics.forEach((topic) => {
      console.log(`[${topic.id}] ${topic.title}`);
    });
  }

  private async blockUser() {
    const userId = await this.prompt("Enter user ID to block: ");
    const user = this.blockUserUseCase.execute(userId, this.currentUser!);
    if (user) {
      console.log(`User ${user.login} has been blocked.`);
    } else {
      console.log("User not found or you do not have permission.");
    }
  }

  private async deleteTopic() {
    const topicId = await this.prompt("Enter topic ID to delete: ");
    const success = this.deleteTopicUseCase.execute(topicId, this.currentUser!);
    if (success) {
      console.log("Topic deleted.");
    } else {
      console.log("Topic not found or you do not have permission.");
    }
  }

  private async viewAllUsers() {
    const users = this.viewAllUsersUseCase.execute(this.currentUser!);
    if (!users) {
      console.log("You do not have permission to view all users.");
      return;
    }

    if (users.length === 0) {
      console.log("No users found.");
      return;
    }

    users.forEach((user) => {
      console.log(
        `[${user.id}] ${user.login} (role: ${user.role}, blocked: ${user.isBlocked})`,
      );
    });
  }
}
