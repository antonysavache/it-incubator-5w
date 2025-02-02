import {Collection, Filter, ObjectId, Sort, WithId} from "mongodb";
import {ModelWithId, PageResponse, QueryParams, SearchParam, ToViewModel, WithMongoId} from "../models/common.model";
import {AbstractRepository} from "./abstract.repository";

export abstract class BaseQueryRepository<T extends ModelWithId> extends AbstractRepository<T> {
    async findAll(params: QueryParams): Promise<PageResponse<ToViewModel<T>>> {
        this.checkInit();

        const additionalFilter = params.blogId ? { blogId: params.blogId } : null;

        const filter = this.buildFilter(params.searchParams, additionalFilter);
        const sort = { [params.sortBy]: params.sortDirection === 'asc' ? 1 : -1 } as Sort;
        const skip = (params.pageNumber - 1) * params.pageSize;

        const [items, totalCount] = await Promise.all([
            this.collection!
                .find(filter as Filter<T>)
                .sort(sort)
                .skip(skip)
                .limit(params.pageSize)
                .toArray(),
            this.collection!.countDocuments(filter as Filter<T>)
        ]);

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount,
            items: items.map(this.toViewModel)
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

    protected buildFilter(searchParams: SearchParam[], additionalFilter?: any): Filter<T> {
        if (!searchParams.length) {
            return {};
        }

        let filter = {};

        filter = searchParams.reduce((acc, param) => ({
            ...acc,
            [param.fieldName]: {
                $regex: param.value,
                $options: 'i'
            }
        }), {});

        if (additionalFilter) {
            filter = { ...filter, ...additionalFilter };
        }

        return filter as Filter<T>;
    }

    private toViewModel(model: WithId<T>): ToViewModel<T> {
        const { _id, ...rest } = model as T;
        return {
            ...rest,
            id: _id.toString()
        };
    }
}