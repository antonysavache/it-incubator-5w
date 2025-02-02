import {BlogsQueryRepository} from "../repositories/blogs-query.repository";
import {BlogsCommandRepository} from "../repositories/blogs-command.repository";
import {PageResponse, QueryParams} from "../../../shared/models/common.model";
import {BlogCreateModel, BlogViewModel} from "../models/blog.model";
import {TimestampService} from "../../../shared/services/time-stamp.service";
import {PostsQueryRepository} from "../../posts/repositories/posts-query.repository";
import {PostCreateModel, PostViewModel} from "../../posts/models/post.model";
import {PostsCommandRepository} from "../../posts/repositories/posts-command.repository";

export class BlogsService {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private blogsCommandRepository: BlogsCommandRepository,
        private postsQueryRepository: PostsQueryRepository,
        private postsCommandRepository: PostsCommandRepository
    ) {}

    async getBlogs(params: QueryParams): Promise<PageResponse<BlogViewModel>> {
        return this.blogsQueryRepository.findAll({
            searchParams: params.searchParams.length ? [
                { fieldName: 'name', value: params.searchParams[0].value }
            ] : [],
            sortBy: params.sortBy || 'createdAt',
            sortDirection: params.sortDirection || 'desc',
            pageNumber: Number(params.pageNumber) || 1,
            pageSize: Number(params.pageSize) || 10
        });
    }

    async getBlog(id: string): Promise<BlogViewModel | null> {
        return this.blogsQueryRepository.findById(id);
    }

    async createBlog(data: BlogCreateModel): Promise<string> {
        const blogToCreate = {
            ...data,
            createdAt: TimestampService.generate(),
            isMembership: false
        };

        return this.blogsCommandRepository.create(blogToCreate);
    }

    async getBlogPosts(blogId: string, params: QueryParams): Promise<PageResponse<PostViewModel>> {
        const blogs = this.postsQueryRepository.findAll({
            searchParams: [],
            sortBy: params.sortBy || 'createdAt',
            sortDirection: params.sortDirection || 'desc',
            pageNumber: Number(params.pageNumber) || 1,
            pageSize: Number(params.pageSize) || 10,
            blogId: blogId
        });
        return blogs ?? null;
    }

    async createBlogPost(data: PostCreateModel): Promise<PostViewModel | null> {
        const blog = await this.blogsQueryRepository.findById(data.blogId);
        if (!blog) return null;

        const postToCreate = {
            ...data,
            createdAt: TimestampService.generate(),
            blogName: blog.name
        };

        const postId = await this.postsCommandRepository.create(postToCreate);
        return this.postsQueryRepository.findById(postId);
    }

    async updateBlog(id: string, data: BlogCreateModel): Promise<boolean> {
        return this.blogsCommandRepository.update(id, data);
    }

    async deleteBlog(id: string): Promise<boolean> {
        return this.blogsCommandRepository.delete(id);
    }

    async deleteAll(): Promise<void> {
        return this.blogsCommandRepository.deleteAll();
    }
}