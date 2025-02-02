import { Request, Response } from "express";
import {blogsService, postsService} from "../../composition-root";

export const testingController = {
    async deleteAll(req: Request, res: Response) {
        await blogsService.deleteAll();
        await postsService.deleteAll();
        res.sendStatus(204);
    }
}