import {BaseCommandRepository} from "../../../configs/base/command-repository.base";
import {PostCreateModel, PostDBModel} from "../models/post.model";


export class PostsCommandRepository extends BaseCommandRepository<PostDBModel, PostCreateModel> {
    constructor() {
        super('posts');
    }
}