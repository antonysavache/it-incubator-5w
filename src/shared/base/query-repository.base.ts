import { Collection, Filter, ObjectId, Sort, WithId } from "mongodb";
import { ModelWithId, PageResponse, PaginationQueryParams, SearchParam, ToViewModel } from "../models/common.model";
import { AbstractRepository } from "./abstract.repository";

export abstract class BaseQueryRepository<T extends ModelWithId> extends AbstractRepository<T> {
    async findAll(params: PaginationQueryParams): Promise<PageResponse<ToViewModel<T>>> {
        this.checkInit();

        const filter = this.buildFilter(params.searchParams, params.blogId ? { blogId: params.blogId } : {});

        let query = this.collection.find(filter);

        if (params.sortBy) {
            const sortDirection = params.sortDirection === 'asc' ? 1 : -1;
            query = query.sort({ [params.sortBy]: sortDirection });
        }

        if (params.pageNumber && params.pageSize) {
            const skip = (Number(params.pageNumber) - 1) * Number(params.pageSize);
            const limit = Number(params.pageSize);
            query = query.skip(skip).limit(limit);
        }

        const [items, totalCount] = await Promise.all([
            query.toArray(),
            this.collection.countDocuments(filter)
        ]);

        const pageNumber = Number(params.pageNumber) || 1;
        const pageSize = Number(params.pageSize) || 10;

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: items.map((item) => this.toViewModel(item))
        };
    }

    async findById(id: string): Promise<ToViewModel<T> | null> {
        this.checkInit();

        if (!ObjectId.isValid(id)) {
            return null;
        }

        const filter = { _id: new ObjectId(id) } as Filter<T>;
        const result = await this.collection!.findOne(filter);

        if (!result) {
            return null;
        }

        return this.toViewModel(result);
    }

    protected buildFilter(searchParams: SearchParam[], additionalFilter: Record<string, any> = {}): Filter<T> {
        if (!searchParams.length) {
            return additionalFilter as Filter<T>;
        }

        const searchConditions = searchParams.map(param => ({
            [param.fieldName]: {
                $regex: param.value,
                $options: 'i'
            }
        }));

        return {
            ...additionalFilter,
            $or: searchConditions
        } as Filter<T>;
    }

    protected toViewModel(model: WithId<T>): ToViewModel<T> {
        const { _id, ...rest } = model;
        return {
            ...rest,
            id: _id.toString()
        } as ToViewModel<T>;
    }
}