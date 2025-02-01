import { Request, Response } from "express";
import {blogsService} from "../../../features/blogs/blogs.composition";
import {postsService} from "../../../features/posts/posts.composition";

export const testingController = {
    async deleteAll(req: Request, res: Response) {
        await blogsService.deleteAll();
        await postsService.deleteAll();
        res.sendStatus(204);
    }
}