import {BaseCommandRepository} from "../../../shared/base/command-repository.base";
import {PostCreateModel, PostDBModel} from "../models/post.model";


export class PostsCommandRepository extends BaseCommandRepository<PostDBModel, PostCreateModel> {
    constructor() {
        super('posts');
    }
}