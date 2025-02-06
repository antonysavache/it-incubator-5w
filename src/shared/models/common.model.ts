import { ObjectId } from "mongodb";

export const DEFAULT_QUERY_PARAMS = {
    sortBy: '_id',
    sortDirection: 'desc' as const,
    pageNumber: '1',
    pageSize: '10'
};

export interface BaseQueryParams {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
}

export interface SearchTerms {
    searchNameTerm?: string | null;
    searchLoginTerm?: string | null;
    searchEmailTerm?: string | null;
}

export const SearchTermsMapping: Record<keyof SearchTerms, string> = {
    searchNameTerm: 'name',
    searchLoginTerm: 'login',
    searchEmailTerm: 'email'
} as const;

export interface SearchParam {
    fieldName: string;
    value: string;
    isExact?: boolean;
}

// Combine base params with search terms
export interface QueryParams extends BaseQueryParams, Partial<SearchTerms> {}

// Repository layer params (all required except blogId)
export interface PaginationQueryParams {
    searchParams: SearchParam[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: string;
    pageSize: string;
    blogId?: string;
}

export interface PageResponse<T> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export type ModelWithId = {
    _id: ObjectId;
}

export type ToViewModel<T extends ModelWithId> = Omit<T, '_id'> & {
    id: string;
}