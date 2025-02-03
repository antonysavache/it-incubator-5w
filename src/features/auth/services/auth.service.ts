import { UsersService } from "../../users/services/users.service";
import { LoginInputModel } from "../models/auth.model";

export class AuthService {
    constructor(private usersService: UsersService) {}

    async checkCredentials(data: LoginInputModel): Promise<boolean> {
        if (!data.loginOrEmail || !data.password) {
            return false;
        }

        return this.usersService.checkCredentials(data.loginOrEmail, data.password);
    }
}