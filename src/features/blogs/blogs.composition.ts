import {BlogsQueryRepository} from "./repositories/blogs-query.repository";
import {BlogsCommandRepository} from "./repositories/blogs-command.repository";
import {BlogsService} from "./services/blogs.service";


export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsCommandRepository = new BlogsCommandRepository();
export const blogsService = new BlogsService(
    blogsQueryRepository,
    blogsCommandRepository
);