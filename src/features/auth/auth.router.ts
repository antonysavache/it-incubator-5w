import { Router } from "express";
import { authController } from "../../shared/composition-root";

export const authRouter = Router();

authRouter.post('/login',
    authController.login
);