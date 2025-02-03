// features/users/models/user.model.ts
import { ModelWithId } from "../../../shared/models/common.model";

export interface UserModel {
    login: string;
    email: string;
    password: string;
    createdAt: string;
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

export interface ErrorMessage {
    message: string;
    field: string;
}

export interface ApiErrorResult {
    errorsMessages: ErrorMessage[];
}