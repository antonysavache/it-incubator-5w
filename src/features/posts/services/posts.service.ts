import {PostsQueryRepository} from "../repositories/posts-query.repository";
import {PostsCommandRepository} from "../repositories/posts-command.repository";
import {BlogsQueryRepository} from "../../blogs/repositories/blogs-query.repository";
import {PageResponse, QueryParams} from "../../../shared/models/common.model";
import {PostCreateModel, PostViewModel} from "../models/post.model";
import {TimestampService} from "../../../shared/services/time-stamp.service";


export class PostsService {
    constructor(
        private postsQueryRepo: PostsQueryRepository,
        private postsCommandRepo: PostsCommandRepository,
        private blogsQueryRepo: BlogsQueryRepository
    ) {}

    async getPosts(params: QueryParams): Promise<PageResponse<PostViewModel>> {
        return this.postsQueryRepo.findAll({
            searchParams: [],
            sortBy: params.sortBy || 'createdAt',
            sortDirection: params.sortDirection || 'desc',
            pageNumber: Number(params.pageNumber) || 1,
            pageSize: Number(params.pageSize) || 10
        });
    }

    async getPost(id: string): Promise<PostViewModel | null> {
        return this.postsQueryRepo.findById(id);
    }

    async createPost(data: PostCreateModel): Promise<PostViewModel | null> {
        const blog = await this.blogsQueryRepo.findById(data.blogId);
        if (!blog) return null;

        const postToCreate = {
            ...data,
            blogName: blog.name,
            createdAt: TimestampService.generate()
        };

        const postId = await this.postsCommandRepo.create(postToCreate);
        return this.postsQueryRepo.findById(postId);
    }

    async updatePost(id: string, data: PostCreateModel): Promise<boolean> {
        const blog = await this.blogsQueryRepo.findById(data.blogId);
        if (!blog) return false;

        return this.postsCommandRepo.update(id, {
            ...data,
        });
    }

    async deletePost(id: string): Promise<boolean> {
        return this.postsCommandRepo.delete(id);
    }

    async deleteAll(): Promise<void> {
        return this.postsCommandRepo.deleteAll();
    }
}