import {BaseQueryRepository} from "../../../configs/base/query-repository.base";
import {UserDBModel} from "../models/user.model";

export class UsersQueryRepository extends BaseQueryRepository<UserDBModel> {
    constructor() {
        super('users');
    }
}