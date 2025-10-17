import * as fs from "fs";
import { Cli } from "./cli";
import { PostRepository } from "./database/repositories/postRepository";
import { TopicRepository } from "./database/repositories/topicRepository";
import { UserRepository } from "./database/repositories/userRepository";
import { Post } from "./domain/post";
import { Topic } from "./domain/topic";
import { User } from "./domain/user";
import { AddPostToTopicUseCase } from "./usecases/addPostToTopic";
import { BlockUserUseCase } from "./usecases/blockUser";
import { CreateTopicUseCase } from "./usecases/createTopic";
import { DeletePostUseCase } from "./usecases/deletePost";
import { DeleteTopicUseCase } from "./usecases/deleteTopic";
import { EditPostUseCase } from "./usecases/editPost";
import { LikePostUseCase } from "./usecases/likePost";
import { LoginUserUseCase } from "./usecases/loginUser";
import { RegisterUserUseCase } from "./usecases/registerUser";
import { SearchTopicsByTagsUseCase } from "./usecases/searchTopicsByTags";
import { ViewAllTopicsUseCase } from "./usecases/viewAllTopics";
import { ViewTopicUseCase } from "./usecases/viewTopic";
import { ViewAllUsersUseCase } from "./usecases/viewAllUsers";

const dataDir = __dirname + "/database/data";
const usersPath = dataDir + "/users.json";
const topicsPath = dataDir + "/topics.json";
const postsPath = dataDir + "/posts.json";

const userRepository = new UserRepository();
const topicRepository = new TopicRepository();
const postRepository = new PostRepository();

const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const createTopicUseCase = new CreateTopicUseCase(topicRepository);
const viewAllTopicsUseCase = new ViewAllTopicsUseCase(topicRepository);
const viewTopicUseCase = new ViewTopicUseCase(topicRepository, postRepository);
const addPostToTopicUseCase = new AddPostToTopicUseCase(postRepository);
const editPostUseCase = new EditPostUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);
const searchTopicsByTagsUseCase = new SearchTopicsByTagsUseCase(
  topicRepository,
);
const likePostUseCase = new LikePostUseCase(postRepository);
const deleteTopicUseCase = new DeleteTopicUseCase(
  topicRepository,
  postRepository,
);
const blockUserUseCase = new BlockUserUseCase(userRepository);
const viewAllUsersUseCase = new ViewAllUsersUseCase(userRepository);

const cli = new Cli(
  userRepository,
  topicRepository,
  postRepository,
  registerUserUseCase,
  loginUserUseCase,
  createTopicUseCase,
  viewAllTopicsUseCase,
  viewTopicUseCase,
  addPostToTopicUseCase,
  editPostUseCase,
  deletePostUseCase,
  searchTopicsByTagsUseCase,
  likePostUseCase,
  deleteTopicUseCase,
  blockUserUseCase,
  viewAllUsersUseCase,
);

function loadData() {
  if (fs.existsSync(usersPath)) {
    const usersData = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
    console.log(usersData.length);
    userRepository.load(usersData.map(User.fromJSON));
  }
  if (fs.existsSync(topicsPath)) {
    const topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
    topicRepository.load(topicsData.map(Topic.fromJSON));
  }
  if (fs.existsSync(postsPath)) {
    const postsData = JSON.parse(fs.readFileSync(postsPath, "utf-8"));
    postRepository.load(postsData.map(Post.fromJSON));
  }
}

function saveData() {
  fs.writeFileSync(
    usersPath,
    JSON.stringify(userRepository.findAll(), null, 2),
  );
  fs.writeFileSync(
    topicsPath,
    JSON.stringify(topicRepository.findAll(), null, 2),
  );
  fs.writeFileSync(
    postsPath,
    JSON.stringify(postRepository.findAll(), null, 2),
  );
  console.log("\nData saved. Goodbye!");
}

loadData();
cli.start();

process.on("exit", saveData);
process.on("SIGINT", () => process.exit());
process.on("SIGUSR1", () => process.exit());
process.on("SIGUSR2", () => process.exit());
process.on("uncaughtException", () => process.exit());
