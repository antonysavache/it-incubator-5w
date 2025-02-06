import request from 'supertest';
import {app} from "../../app";
import {SETTINGS} from "../../configs/settings";
import {UserViewModel} from "./models/user.model";

describe('users testing', () => {
    const correctUser = {
        login: "lg-001",
        password: "qwerty1",
        email: "email001@gmail.com"
    };
    let createdUser: UserViewModel | null = null;

    beforeEach(async () => {
        // Clear database before each test
        await request(app).delete(SETTINGS.PATH.TESTING_DELETE).expect(204);
    });

    it('should return empty array', async () => {
        const response = await request(app)
            .get(SETTINGS.PATH.USERS)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(200);

        expect(response.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
    });

    it('should not create user without auth', async () => {
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .send(correctUser)
            .expect(401);
    });

    it('should not create user with incorrect data', async () => {
        const response = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: "",
                password: "",
                email: "not-email"
            })
            .expect(400);

        expect(response.body).toEqual({
            errorsMessages: expect.arrayContaining([
                {message: expect.any(String), field: "login"},
                {message: expect.any(String), field: "password"},
                {message: expect.any(String), field: "email"}
            ])
        });
    });

    describe('user creation and management', () => {
        beforeEach(async () => {
            // Verify database is empty before each test
            const checkResponse = await request(app)
                .get(SETTINGS.PATH.USERS)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5');

            expect(checkResponse.body.totalCount).toBe(0);
        });

        it('should create user with correct data and return in users list', async () => {
            // Create user
            const createResponse = await request(app)
                .post(SETTINGS.PATH.USERS)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send(correctUser)
                .expect(201);

            createdUser = createResponse.body;

            expect(createdUser).toEqual({
                id: expect.any(String),
                login: correctUser.login,
                email: correctUser.email,
                createdAt: expect.any(String)
            });

            // Verify user appears in list
            const listResponse = await request(app)
                .get(SETTINGS.PATH.USERS)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(200);

            expect(listResponse.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdUser]
            });

            // Test login with created user
            await request(app)
                .post(SETTINGS.PATH.AUTH + '/login')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    loginOrEmail: correctUser.login,
                    password: correctUser.password
                })
                .expect(204);
        });

        it('should not create duplicate users', async () => {
            // Create first user
            await request(app)
                .post(SETTINGS.PATH.USERS)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send(correctUser)
                .expect(201);

            // Attempt to create duplicate
            await request(app)
                .post(SETTINGS.PATH.USERS)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send(correctUser)
                .expect(400);
        });

        it('should delete user correctly', async () => {
            // Create user
            const createResponse = await request(app)
                .post(SETTINGS.PATH.USERS)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send(correctUser)
                .expect(201);

            const userId = createResponse.body.id;

            // Delete user
            await request(app)
                .delete(`${SETTINGS.PATH.USERS}/${userId}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(204);

            // Verify deletion
            await request(app)
                .get(`${SETTINGS.PATH.USERS}/${userId}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(404);
        });
    });
});