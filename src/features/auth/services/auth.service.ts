import { UsersService } from "../../users/services/users.service";
import bcrypt from "bcrypt";

export class AuthService {
    constructor(private usersService: UsersService) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        console.log('Checking credentials for:', loginOrEmail);
        const user = await this.usersService.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            console.log('User not found');
            return false;
        }

        console.log('Found user:', user);
        console.log('Comparing passwords:', password, user.password);

        try {
            const isValid = await bcrypt.compare(password, user.password);
            console.log('Password comparison result:', isValid);
            return isValid;
        } catch (error) {
            console.error('Auth error:', error);
            return false;
        }
    }
}