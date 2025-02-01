import { Request, Response } from 'express';
import { PostsService } from "./services/posts.service";
import { QueryParams } from "../../shared/models/common.model";

export class PostsController {
    constructor(private postsService: PostsService) {}

    getPosts = async (req: Request, res: Response) => {
        const params: QueryParams = {
            searchParams: [],
            sortBy: req.query.sortBy?.toString() || 'createdAt',
            sortDirection: req.query.sortDirection as 'asc' | 'desc' || 'desc',
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10
        };

        const posts = await this.postsService.getPosts(params);
        res.status(200).json(posts);
    }

    getPost = async (req: Request, res: Response) => {
        const post = await this.postsService.getPost(req.params.id);
        res.status(post ? 200 : 404).json(post);
    }

    createPost = async (req: Request, res: Response) => {
        const { title, shortDescription, content, blogId } = req.body;
        const newPost = await this.postsService.createPost({
            title,
            shortDescription,
            content,
            blogId
        });
        res.status(newPost ? 201 : 404).json(newPost);
    }

    updatePost = async (req: Request, res: Response) => {
        const updated = await this.postsService.updatePost(
            req.params.id,
            req.body
        );
        res.sendStatus(updated ? 204 : 404);
    }

    deletePost = async (req: Request, res: Response) => {
        const deleted = await this.postsService.deletePost(req.params.id);
        res.sendStatus(deleted ? 204 : 404);
    }

    deleteAll = async (req: Request, res: Response) => {
        await this.postsService.deleteAll();
        res.sendStatus(204);
    }
}