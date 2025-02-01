import { BlogsController } from './blogs.controller';
import {BlogsQueryRepository} from "./repositories/blogs-query.repository";
import {BlogsCommandRepository} from "./repositories/blogs-command.repository";
import {BlogsService} from "./services/blogs.service";
import {postsCommandRepository, postsQueryRepository, postsService} from "../posts/posts.composition";

export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsCommandRepository = new BlogsCommandRepository();

export const blogsService = new BlogsService(
    blogsQueryRepository,
    blogsCommandRepository,
    postsQueryRepository,
    postsCommandRepository
);

export const blogsController = new BlogsController(blogsService, postsService);