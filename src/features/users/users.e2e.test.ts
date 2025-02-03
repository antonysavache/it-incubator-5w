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

    beforeAll(async () => {
        await request(app).delete(SETTINGS.PATH.TESTING_DELETE).expect(204);
    }, 10000);

    it('should return empty array', async () => {
        await request(app)
            .get(SETTINGS.PATH.USERS)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(200, {
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

    it('should create user with correct data', async () => {
        const response = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctUser)
            .expect(201);

        createdUser = response.body;

        expect(createdUser).toEqual({
            id: expect.any(String),
            login: correctUser.login,
            email: correctUser.email,
            createdAt: expect.any(String)
        });
    });

    it('should return users with pagination', async () => {
        const response = await request(app)
            .get(SETTINGS.PATH.USERS + '?pageSize=50')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(200);

        console.log(response.body)

        expect(response.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdUser]
        });
    });

    it('should not delete user without auth', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.USERS}/${createdUser!.id}`)
            .expect(401);
    });

    it('should delete user with correct id', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.USERS}/${createdUser!.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204);

        await request(app)
            .get(SETTINGS.PATH.USERS)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
    });

    it('should return 404 for not existing user', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.USERS}/${createdUser!.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404);
    });
});