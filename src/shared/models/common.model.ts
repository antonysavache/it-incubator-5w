import {ObjectId} from "mongodb";

export interface Pagination {
    pageNumber: number;
    pageSize: number;
}

export interface Sort {
    field: string;
    direction: 'asc' | 'desc';
}

export interface Filter {
    [key: string]: any;
}

export type WithMongoId = {
    _id: ObjectId;
}


export type ModelWithId = {
    _id: ObjectId
}

export type ToViewModel<T extends ModelWithId> = Omit<T, '_id'> & {
    id: string
}

export interface PageResponse<T> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export interface SearchParam {
    fieldName: string;
    value: any;
}

export interface QueryParams {
    searchParams: SearchParam[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
    blogId?: string;
}