import { Collection, Filter, ObjectId, Sort, WithId } from "mongodb";
import { ModelWithId, PageResponse, PaginationQueryParams, SearchParam, ToViewModel } from "../models/common.model";
import { AbstractRepository } from "./abstract.repository";

export abstract class BaseQueryRepository<T extends ModelWithId> extends AbstractRepository<T> {
    async findAll(params: PaginationQueryParams): Promise<PageResponse<ToViewModel<T>>> {
        this.checkInit();

        const additionalFilter = params.blogId ? { blogId: params.blogId } : {};
        const filter = this.buildFilter(params.searchParams, additionalFilter);
        const sort = { [params.sortBy]: params.sortDirection === 'asc' ? 1 : -1 } as Sort;

        // Convert string values to numbers for pagination calculations
        const pageNumber = Number(params.pageNumber) || 1;
        const pageSize = Number(params.pageSize) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            this.collection!
                .find(filter as Filter<T>)
                .sort(sort)
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            this.collection!.countDocuments(filter as Filter<T>)
        ]);

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

        const result = await this.collection!.findOne({ _id: new ObjectId(id) } as Filter<T>);

        if (!result) {
            return null;
        }

        return this.toViewModel(result);
    }

    protected buildFilter(searchParams: SearchParam[], additionalFilter: Record<string, any> = {}): Filter<T> {
        if (!searchParams.length) {
            return additionalFilter as Filter<T>;
        }

        const searchFilter = searchParams.reduce((acc, param) => ({
            ...acc,
            [param.fieldName]: {
                $regex: param.value,
                $options: 'i'
            }
        }), {});

        return { ...additionalFilter, ...searchFilter } as Filter<T>;
    }

    protected toViewModel(model: WithId<T>): ToViewModel<T> {
        const { _id, ...rest } = model;
        return {
            ...rest,
            id: _id.toString()
        } as ToViewModel<T>;
    }
}