import { UsersQueryRepository } from "../repositories/users-query.repository";
import { UsersCommandRepository } from "../repositories/users-command.repository";
import { DEFAULT_QUERY_PARAMS, PageResponse, PaginationQueryParams, QueryParams } from "../../../shared/models/common.model";
import { ApiErrorResult, UserCreateModel, UserViewModel, UserDBModel } from "../models/user.model";
import { TimestampService } from "../../../shared/services/time-stamp.service";
import bcrypt from 'bcrypt';
import { SETTINGS } from "../../../configs/settings";

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

        const queryParams: PaginationQueryParams = {
            searchParams,
            sortBy: params.sortBy || DEFAULT_QUERY_PARAMS.sortBy,
            sortDirection: params.sortDirection || DEFAULT_QUERY_PARAMS.sortDirection,
            pageNumber: params.pageNumber || DEFAULT_QUERY_PARAMS.pageNumber,
            pageSize: params.pageSize || DEFAULT_QUERY_PARAMS.pageSize
        };

        return this.usersQueryRepository.findAll(queryParams);
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

        const passwordHash = await bcrypt.hash(data.password, SETTINGS.SALT_ROUNDS);

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

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const user = await this.usersQueryRepository.findAll({
            searchParams: [
                { fieldName: 'login', value: loginOrEmail },
                { fieldName: 'email', value: loginOrEmail }
            ],
            sortBy: 'createdAt',
            sortDirection: 'desc',
            pageNumber: '1',
            pageSize: '1'
        });

        return user.items[0] as unknown as UserDBModel || null;
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

    async deleteAll(): Promise<void> {
        return this.usersCommandRepository.deleteAll();
    }

    private async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const result = await this.usersQueryRepository.findAll({
            searchParams: [
                { fieldName: 'login', value: loginOrEmail },
                { fieldName: 'email', value: loginOrEmail }
            ],
            ...DEFAULT_QUERY_PARAMS
        });

        if (!result.items.length) return null;
        return result.items[0] as unknown as UserDBModel;
    }

    private async checkUserExists(login: string, email: string): Promise<string | null> {
        const result = await this.usersQueryRepository.findAll({
            searchParams: [
                { fieldName: 'email', value: email, isExact: true },
                { fieldName: 'login', value: login, isExact: true }
            ],
            sortBy: 'createdAt',
            sortDirection: 'desc',
            pageNumber: '1',
            pageSize: '1'
        });

        if (!result.items.length) return null;

        const existingUser = result.items[0] as any;
        if (existingUser.email.toLowerCase() === email.toLowerCase()) return 'email';
        if (existingUser.login.toLowerCase() === login.toLowerCase()) return 'login';

        return null;
    }
}