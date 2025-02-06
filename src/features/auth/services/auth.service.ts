import { UsersService } from "../../users/services/users.service";
import bcrypt from "bcrypt";

export class AuthService {
    constructor(private usersService: UsersService) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await this.usersService.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            return false;
        }

        try {
            const isValid = await bcrypt.compare(password, user.password);
            return isValid;
        } catch (error) {
            return false;
        }
    }
}