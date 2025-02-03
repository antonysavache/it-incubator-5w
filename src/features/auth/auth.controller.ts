import { Request, Response } from "express";
import { AuthService } from "./services/auth.service";
import { LoginInputModel } from "./models/auth.model";

export class AuthController {
    constructor(private authService: AuthService) {}

    login = async (req: Request<{}, {}, LoginInputModel>, res: Response): Promise<Response> => {
        const creds = {
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password
        } as LoginInputModel
        const isValid = await this.authService.checkCredentials(creds
        );

        return res.sendStatus(isValid ? 204 : 401);
    }
}