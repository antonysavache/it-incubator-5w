
import {UsersQueryRepository} from "../repositories/users-query.repository";
import {UsersCommandRepository} from "../repositories/users-command.repository";

export class UsersService {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersCommandRepository: UsersCommandRepository,
    ) {
    }
}
