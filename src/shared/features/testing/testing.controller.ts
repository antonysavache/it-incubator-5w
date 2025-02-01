import { Request, Response } from "express";

export const testingController = {
    async deleteAll(req: Request, res: Response) {
        // await blogsService.deleteBlogs();
        // await postsService.deletePosts();
        res.sendStatus(204);
    }
}