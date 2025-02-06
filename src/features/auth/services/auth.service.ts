import { UsersService } from "../../users/services/users.service";
import bcrypt from "bcrypt";

export class AuthService {
    constructor(private usersService: UsersService) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await this.usersService.findByLoginOrEmail(loginOrEmail);
        if (!user) return false;

        try {
            return await bcrypt.compare(password, user.password);
        } catch (error) {
            console.error('Auth error:', error);
            return false;
        }
    }
}