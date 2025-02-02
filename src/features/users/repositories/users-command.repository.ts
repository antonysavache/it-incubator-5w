import {UserCreateModel, UserDBModel} from "../models/user.model";
import {BaseCommandRepository} from "../../../shared/base/command-repository.base";

export class UsersCommandRepository extends BaseCommandRepository<UserDBModel, UserCreateModel> {
    constructor() {
        super('users');
    }
}