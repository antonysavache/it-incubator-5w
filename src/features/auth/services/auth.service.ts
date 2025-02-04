import { UsersService } from "../../users/services/users.service";
import bcrypt from "bcrypt";

export class AuthService {
    constructor(private usersService: UsersService) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        try {
            const result = await this.usersService.findByLoginOrEmail(loginOrEmail);
            if (!result) return false;

            return await bcrypt.compare(password, result.password);
        } catch (error) {
            console.error('Auth error:', error);
            return false;
        }
    }
}