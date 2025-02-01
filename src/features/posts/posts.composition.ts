import { PostsController } from './posts.controller';
import {PostsQueryRepository} from "./repositories/posts-query.repository";
import {PostsCommandRepository} from "./repositories/posts-command.repository";
import {PostsService} from "./services/posts.service";
import {blogsQueryRepository} from "../blogs/blogs.composition";

export const postsQueryRepository = new PostsQueryRepository();
export const postsCommandRepository = new PostsCommandRepository();

export const postsService = new PostsService(
    postsQueryRepository,
    postsCommandRepository,
    blogsQueryRepository
);
export const postsController = new PostsController(postsService);
