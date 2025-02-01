import { ModelWithId } from '../../../shared/models/common.model';

interface PostBase {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export type PostCreateModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export interface PostViewModel {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export type PostDBModel = PostBase & ModelWithId;