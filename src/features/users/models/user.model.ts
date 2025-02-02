import {ModelWithId} from "../../../shared/models/common.model";

export interface UserModel {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export type UserCreateModel = {
    login: string;
    password: string;
    email: string;
}

export interface UserViewModel {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export type UserDBModel = UserModel & ModelWithId;


