import { Request, Response } from 'express';
import { QueryParams } from "../../shared/models/common.model";
import { UsersService } from "./services/users.service";
import { UserCreateModel } from './models/user.model';

export class UsersController {
    constructor(private usersService: UsersService) {}

    getUsers = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
        const params: QueryParams = {
            searchLoginTerm: req.query.searchLoginTerm?.toString(),
            searchEmailTerm: req.query.searchEmailTerm?.toString(),
            sortBy: req.query.sortBy?.toString(),
            sortDirection: req.query.sortDirection as 'asc' | 'desc',
            pageNumber: req.query.pageNumber?.toString(),
            pageSize: req.query.pageSize?.toString()
        };

        const users = await this.usersService.getUsers(params);

        return res.status(200).json(users);
    }

    createUser = async (req: Request<{}, {}, UserCreateModel>, res: Response) => {
        const result = await this.usersService.createUser(req.body);

        if ('errorsMessages' in result) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    }

    deleteUser = async (req: Request<{ id: string }>, res: Response) => {
        const deleted = await this.usersService.deleteUser(req.params.id);
        return res.sendStatus(deleted ? 204 : 404);
    }
}