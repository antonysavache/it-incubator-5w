import { Request, Response } from 'express';
import { QueryParams } from "../../shared/models/common.model";
import {UsersService} from "./services/users.service";

export class UsersController {
    constructor(private usersService: UsersService) {}

    // getUsers = async (req: Request, res: Response) => {
    //     const params: QueryParams = {
    //         searchParams: [],
    //         sortBy: req.query.sortBy?.toString() || '_id',
    //         sortDirection: req.query.sortDirection as 'asc' | 'desc' || 'desc',
    //         pageNumber: Number(req.query.pageNumber) || 1,
    //         pageSize: Number(req.query.pageSize) || 10
    //     };
    //
    //     const posts = await this.postsService.getPosts(params);
    //     res.status(200).json(posts);
    // }
    //
    // createUser = async (req: Request, res: Response) => {
    //     const { title, shortDescription, content, blogId } = req.body;
    //     const newPost = await this.postsService.createPost({
    //         title,
    //         shortDescription,
    //         content,
    //         blogId
    //     });
    //     res.status(newPost ? 201 : 404).json(newPost);
    // }
    //
    // deleteUser = async (req: Request, res: Response) => {
    //     const deleted = await this.postsService.deletePost(req.params.id);
    //     res.sendStatus(deleted ? 204 : 404);
    // }
    //
    // deleteAll = async (req: Request, res: Response) => {
    //     await this.postsService.deleteAll();
    //     res.sendStatus(204);
    // }
}