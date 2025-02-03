import { UsersService } from "../../users/services/users.service";
import { LoginInputModel } from "../models/auth.model";

export class AuthService {
    constructor(private usersService: UsersService) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        if (!loginOrEmail || !password) {
            return false;
        }

        return this.usersService.checkCredentials(loginOrEmail, password);
    }
}