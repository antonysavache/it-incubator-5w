// blogs.service.ts
import {BlogsQueryRepository} from "../repositories/blogs-query.repository";
import {BlogsCommandRepository} from "../repositories/blogs-command.repository";
import {PageResponse, QueryParams} from "../../../shared/models/common.model";
import {BlogCreateModel, BlogViewModel} from "../models/blog.model";
import {TimestampService} from "../../../shared/services/time-stamp.service";

export class BlogsService {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private blogsCommandRepository: BlogsCommandRepository,
        // private postsQueryRepository: PostsQueryRepository,  // для getBlogPosts
    ) {}

    async getBlogs(params: QueryParams): Promise<PageResponse<BlogViewModel>> {
        return this.blogsQueryRepository.findAll({
            searchParams: params.searchNameTerm ? [
                { fieldName: 'name', value: params.searchNameTerm }
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

    async updateBlog(id: string, data: BlogCreateModel): Promise<boolean> {
        return this.blogsCommandRepository.update(id, data);
    }

    async deleteBlog(id: string): Promise<boolean> {
        return this.blogsCommandRepository.delete(id);
    }

    async deleteBlogs(): Promise<void> {
        return this.blogsCommandRepository.deleteAll();
    }
}