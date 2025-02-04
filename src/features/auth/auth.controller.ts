import { Request, Response } from "express";
import { AuthService } from "./services/auth.service";
import { LoginInputModel } from "./models/auth.model";

export class AuthController {
    constructor(private authService: AuthService) {}

    login = async (req: Request<{}, {}, LoginInputModel>, res: Response) => {
        const { loginOrEmail, password } = req.body;

        if (!loginOrEmail || !password) {
            return res.sendStatus(400);
        }

        const isValid = await this.authService.checkCredentials(loginOrEmail, password);
        return res.sendStatus(isValid ? 204 : 401);
    }
}