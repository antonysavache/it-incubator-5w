import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { handleValidationErrors } from "../../shared/middlewares/error-handler.middleware";
import {usersValidation} from "./middlewares/users-validation.middleware";
import {usersController} from "../../configs/composition-root";

export const usersRouter = Router();
debugger
usersRouter.get('/',
    authMiddleware,
    usersController.getUsers
);

usersRouter.post('/',
    authMiddleware,
    usersValidation,
    handleValidationErrors,
    usersController.createUser
);

usersRouter.delete('/:id',
    authMiddleware,
    usersController.deleteUser
);