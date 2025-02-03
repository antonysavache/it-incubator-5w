import { Router } from "express";
import { authController } from "../../configs/composition-root";

export const authRouter = Router();

authRouter.post('/login',
    authController.login
);