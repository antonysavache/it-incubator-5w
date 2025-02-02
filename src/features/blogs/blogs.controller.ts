import { BlogsService } from "./services/blogs.service";
import { QueryParams } from "../../shared/models/common.model";
import { Request, Response } from "express";
import { PostsService } from "../posts/services/posts.service";

export class BlogsController {
    constructor(private blogsService: BlogsService, private postsService: PostsService) {}

    getBlogs = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
        const params: QueryParams = {
            searchNameTerm: req.query.searchNameTerm?.toString(),
            sortBy: req.query.sortBy?.toString(),
            sortDirection: req.query.sortDirection as 'asc' | 'desc',
            pageNumber: req.query.pageNumber?.toString(),
            pageSize: req.query.pageSize?.toString()
        };

        const blogs = await this.blogsService.getBlogs(params);
        res.status(200).json(blogs);
    }

    getBlogPosts = async (req: Request<{id: string}, {}, {}, QueryParams>, res: Response) => {
        const params: QueryParams = {
            sortBy: req.query.sortBy?.toString(),
            sortDirection: req.query.sortDirection as 'asc' | 'desc',
            pageNumber: req.query.pageNumber?.toString(),
            pageSize: req.query.pageSize?.toString()
        };

        const posts = await this.blogsService.getBlogPosts(req.params.id, params);
        if (!posts) {
            res.sendStatus(404);
        } else {
            res.json(posts);
        }
    }

    getBlog = async (req: Request, res: Response) => {
        const blog = await this.blogsService.getBlog(req.params.id);
        res.status(blog ? 200 : 404).json(blog);
    }

    createBlog = async (req: Request, res: Response) => {
        const { name, description, websiteUrl } = req.body;

        const blogId = await this.blogsService.createBlog({
            name,
            description,
            websiteUrl
        });

        const createdBlog = await this.blogsService.getBlog(blogId);
        res.status(201).json(createdBlog);
    }

    createBlogPost = async (req: Request, res: Response) => {
        const { id: blogId } = req.params;
        const { title, shortDescription, content } = req.body;

        const newPost = await this.postsService.createPost({
            title,
            shortDescription,
            content,
            blogId
        });

        res.status(newPost ? 201 : 404).json(newPost);
    }

    updateBlog = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, description, websiteUrl } = req.body;

        const updated = await this.blogsService.updateBlog(id, {
            name,
            description,
            websiteUrl
        });

        res.sendStatus(updated ? 204 : 404);
    }

    deleteBlogs = async (req: Request, res: Response) => {
        await this.blogsService.deleteAll();
        res.sendStatus(204);
    }

    deleteBlog = async (req: Request, res: Response) => {
        const { id } = req.params;
        const deleted = await this.blogsService.deleteBlog(id);
        res.sendStatus(deleted ? 204 : 404);
    }
}