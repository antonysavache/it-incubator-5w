import {BaseQueryRepository} from "../../../configs/base/query-repository.base";
import {PostDBModel} from "../models/post.model";


export class PostsQueryRepository extends BaseQueryRepository<PostDBModel> {
    constructor() {
        super('posts');
    }
}