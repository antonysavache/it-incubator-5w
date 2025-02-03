import {BlogDBModel} from "../models/blog.model";
import {BaseQueryRepository} from "../../../configs/base/query-repository.base";

export class BlogsQueryRepository extends BaseQueryRepository<BlogDBModel> {
    constructor() {
        super('blogs');
    }
}