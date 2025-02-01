import {ModelWithId} from "../../../shared/models/common.model";

export interface BlogModel {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export type BlogCreateModel = {
    name: string;
    description: string;
    websiteUrl: string;
}

export interface BlogViewModel {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export type BlogDBModel = BlogModel & ModelWithId;


