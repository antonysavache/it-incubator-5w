import {BlogCreateModel, BlogDBModel} from "../models/blog.model";
import {BaseCommandRepository} from "../../../configs/base/command-repository.base";

export class BlogsCommandRepository extends BaseCommandRepository<BlogDBModel, BlogCreateModel> {
    constructor() {
        super('blogs');
    }
}