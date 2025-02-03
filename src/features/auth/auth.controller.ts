import { Request, Response } from "express";
import { AuthService } from "./services/auth.service";
import { LoginInputModel } from "./models/auth.model";

export class AuthController {
    constructor(private authService: AuthService) {}

    login = async (req: Request<{}, {}, LoginInputModel>, res: Response): Promise<Response> => {
        const isValid = await this.authService.checkCredentials(
            req.body.loginOrEmail,
            req.body.password
        );
        return res.sendStatus(isValid ? 204 : 401);
    }
}