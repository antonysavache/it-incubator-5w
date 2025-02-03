import request from 'supertest';
import {app} from "../../app";
import {SETTINGS} from "../../configs/settings";

describe('auth testing', () => {
    const testUser = {
        login: "auth-user",
        password: "qwerty1",
        email: "auth@gmail.com"
    };

    beforeAll(async () => {
        await request(app).delete(SETTINGS.PATH.TESTING_DELETE).expect(204);

        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(testUser)
            .expect(201);
    }, 10000);

    it('should login with correct credentials', async () => {
        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                loginOrEmail: testUser.login,
                password: testUser.password
            })
            .expect(204);

        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                loginOrEmail: testUser.email,
                password: testUser.password
            })
            .expect(204);
    });

    it('should not login with incorrect password', async () => {
        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                loginOrEmail: testUser.login,
                password: 'wrong-password'
            })
            .expect(401);
    });

    it('should not login with incorrect login', async () => {
        await request(app)
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                loginOrEmail: 'wrong-login',
                password: testUser.password
            })
            .expect(401);
    });
});