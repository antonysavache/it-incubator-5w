import { UsersService } from "../../users/services/users.service";

export class AuthService {
    constructor(private usersService: UsersService) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        if (!loginOrEmail || !password) {
            return false;
        }

        return this.usersService.checkCredentials(loginOrEmail, password);
    }
}