import { BlogsQueryRepository } from "../features/blogs/repositories/blogs-query.repository";
import { BlogsCommandRepository } from "../features/blogs/repositories/blogs-command.repository";
import { BlogsService } from "../features/blogs/services/blogs.service";
import { BlogsController } from "../features/blogs/blogs.controller";

import { PostsQueryRepository } from "../features/posts/repositories/posts-query.repository";
import { PostsCommandRepository } from "../features/posts/repositories/posts-command.repository";
import { PostsService } from "../features/posts/services/posts.service";
import { PostsController } from "../features/posts/posts.controller";

// Repositories
export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsCommandRepository = new BlogsCommandRepository();
export const postsQueryRepository = new PostsQueryRepository();
export const postsCommandRepository = new PostsCommandRepository();

// Services
export const postsService = new PostsService(
    postsQueryRepository,
    postsCommandRepository,
    blogsQueryRepository
);

export const blogsService = new BlogsService(
    blogsQueryRepository,
    blogsCommandRepository,
    postsQueryRepository,
    postsCommandRepository
);

// Controllers
export const blogsController = new BlogsController(
    blogsService,
    postsService
);
export const postsController = new PostsController(
    postsService
);