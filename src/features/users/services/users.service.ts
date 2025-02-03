// features/users/services/users.service.ts
import { UsersQueryRepository } from "../repositories/users-query.repository";
import { UsersCommandRepository } from "../repositories/users-command.repository";
import { PageResponse, QueryParams } from "../../../shared/models/common.model";
import { ApiErrorResult, UserCreateModel, UserViewModel, UserDBModel } from "../models/user.model";
import { TimestampService } from "../../../shared/services/time-stamp.service";
import bcrypt from 'bcrypt';
import { SETTINGS } from "../../../settings";

export class UsersService {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersCommandRepository: UsersCommandRepository,
    ) {}

    async getUsers(params: QueryParams): Promise<PageResponse<UserViewModel>> {
        const searchParams = [];
        if (params.searchLoginTerm) {
            searchParams.push({ fieldName: 'login', value: params.searchLoginTerm });
        }
        if (params.searchEmailTerm) {
            searchParams.push({ fieldName: 'email', value: params.searchEmailTerm });
        }

        return this.usersQueryRepository.findAll({
            searchParams,
            sortBy: params.sortBy || 'createdAt',
            sortDirection: params.sortDirection || 'desc',
            pageNumber: params.pageNumber || '1',
            pageSize: params.pageSize || '10'
        });
    }

    async createUser(data: UserCreateModel): Promise<UserViewModel | ApiErrorResult> {
        const existingUser = await this.checkUserExists(data.login, data.email);
        if (existingUser) {
            return {
                errorsMessages: [{
                    message: `${existingUser} should be unique`,
                    field: existingUser
                }]
            };
        }

        const passwordHash = await this.generateHash(data.password);

        const userToCreate = {
            ...data,
            password: passwordHash,
            createdAt: TimestampService.generate()
        };

        const userId = await this.usersCommandRepository.create(userToCreate);
        const createdUser = await this.usersQueryRepository.findById(userId);

        if (!createdUser) throw new Error('User not found after creation');
        return createdUser;
    }

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await this.findUserByLoginOrEmail(loginOrEmail);
        if (!user) return false;

        const dbUser = user as UserDBModel;
        return await bcrypt.compare(password, dbUser.password);
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.usersCommandRepository.delete(id);
    }

    private async generateHash(password: string): Promise<string> {
        return await bcrypt.hash(password, SETTINGS.SALT_ROUNDS);
    }

    private async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const result = await this.usersQueryRepository.findAll({
            searchParams: [
                { fieldName: 'login', value: loginOrEmail },
                { fieldName: 'email', value: loginOrEmail }
            ],
            sortBy: '_id',
            sortDirection: 'desc',
            pageNumber: '1',
            pageSize: '1'
        });

        if (!result.items.length) return null;
        return result.items[0] as unknown as UserDBModel;
    }

    private async checkUserExists(login: string, email: string): Promise<string | null> {
        const result = await this.usersQueryRepository.findAll({
            searchParams: [
                { fieldName: 'login', value: login },
                { fieldName: 'email', value: email }
            ],
            sortBy: '_id',
            sortDirection: 'desc',
            pageNumber: '1',
            pageSize: '1'
        });

        if (!result.items.length) return null;
        const user = result.items[0];
        return user.email === email ? 'email' : 'login';
    }
}