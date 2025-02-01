import {Router} from "express";
import {SETTINGS} from "../../settings";
import {blogsController} from "./blogs.composition";
import {authMiddleware} from "../../shared/middlewares/auth.middleware";
import {handleValidationErrors} from "../../shared/middlewares/error-handler.middleware";
import {blogsValidation} from "./blogs-validation.middleware";
import {postsValidation} from "../posts/posts-validation.middleware";


export const blogsRouter = Router({});

blogsRouter.get(SETTINGS.PATH.ROOT, blogsController.getBlogs);
blogsRouter.post(SETTINGS.PATH.ROOT, blogsValidation, authMiddleware, handleValidationErrors, blogsController.createBlog);
blogsRouter.get(SETTINGS.PATH.ROOT_ENTITY, blogsController.getBlog);
blogsRouter.get(SETTINGS.PATH.ROOT_ENTITY + SETTINGS.PATH.POSTS,
    blogsController.getBlogPosts
);
blogsRouter.post(
    SETTINGS.PATH.ROOT_ENTITY + SETTINGS.PATH.POSTS,
    postsValidation,
    authMiddleware,
    handleValidationErrors,
    blogsController.createBlogPost
);
blogsRouter.put(SETTINGS.PATH.ROOT_ENTITY, blogsValidation, authMiddleware, handleValidationErrors, blogsController.updateBlog);
blogsRouter.delete(SETTINGS.PATH.ROOT_ENTITY, authMiddleware, blogsController.deleteBlog);
blogsRouter.delete(SETTINGS.PATH.ROOT, authMiddleware, blogsController.deleteBlogs);
