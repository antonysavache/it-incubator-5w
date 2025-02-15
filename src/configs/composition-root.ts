import { BlogsQueryRepository } from "../features/blogs/repositories/blogs-query.repository";
import { BlogsCommandRepository } from "../features/blogs/repositories/blogs-command.repository";
import { BlogsService } from "../features/blogs/services/blogs.service";
import { BlogsController } from "../features/blogs/blogs.controller";

import { PostsQueryRepository } from "../features/posts/repositories/posts-query.repository";
import { PostsCommandRepository } from "../features/posts/repositories/posts-command.repository";
import { PostsService } from "../features/posts/services/posts.service";
import { PostsController } from "../features/posts/posts.controller";

import { UsersQueryRepository } from "../features/users/repositories/users-query.repository";
import { UsersCommandRepository } from "../features/users/repositories/users-command.repository";
import { UsersService } from "../features/users/services/users.service";
import { UsersController } from "../features/users/users.controller";
import {AuthService} from "../features/auth/services/auth.service";
import {AuthController} from "../features/auth/auth.controller";

// Repositories
export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsCommandRepository = new BlogsCommandRepository();
export const postsQueryRepository = new PostsQueryRepository();
export const postsCommandRepository = new PostsCommandRepository();
export const usersQueryRepository = new UsersQueryRepository();
export const usersCommandRepository = new UsersCommandRepository();

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

export const usersService = new UsersService(
    usersQueryRepository,
    usersCommandRepository
);

export const authService = new AuthService(usersService);

// Controllers
export const blogsController = new BlogsController(
    blogsService,
    postsService
);

export const postsController = new PostsController(
    postsService
);

export const usersController = new UsersController(
    usersService
);

export const authController = new AuthController(authService);