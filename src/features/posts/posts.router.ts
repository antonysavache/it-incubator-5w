// features/posts/posts.router.ts
import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { handleValidationErrors } from '../../shared/middlewares/error-handler.middleware';
import {blogIdValidation, postsValidation} from "./posts-validation.middleware";
import {postsController} from "../../configs/composition-root";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPosts.bind(postsController));
postsRouter.get('/:id', postsController.getPost.bind(postsController));
postsRouter.post('/',
    authMiddleware,
    blogIdValidation,
    postsValidation,
    handleValidationErrors,
    postsController.createPost.bind(postsController)
);
postsRouter.put('/:id',
    authMiddleware,
    blogIdValidation,
    postsValidation,
    handleValidationErrors,
    postsController.updatePost.bind(postsController)
);
postsRouter.delete('/:id', authMiddleware, postsController.deletePost.bind(postsController));
postsRouter.delete('/', authMiddleware, postsController.deleteAll.bind(postsController));