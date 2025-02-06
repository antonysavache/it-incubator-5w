import { Request, Response } from "express";
import {blogsService, postsService, usersService} from "../../../configs/composition-root";

export const testingController = {
    async deleteAll(req: Request, res: Response) {
        await blogsService.deleteAll();
        await postsService.deleteAll();
        await usersService.deleteAll();
        res.sendStatus(204);
    }
}