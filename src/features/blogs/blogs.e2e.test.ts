import request from 'supertest';
import {app} from "../../app";
import {SETTINGS} from "../../configs/settings";
import {basicAuthMock, blogsMock, getBasicAuthHeader} from "./blogs.mock";

describe('blogs testing', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204);
    });

    // Testing GET /blogs
    it('should return empty array', async () => {
        await request(app)
            .get(SETTINGS.PATH.BLOGS)
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
    });

    // Testing POST /blogs
    it('should not create blog with incorrect input data', async () => {
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getBasicAuthHeader())
            .send(blogsMock.incorrect)
            .expect(400);
    });

    it('should not create blog with unauthorized user', async () => {
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .send(blogsMock.correct)
            .expect(401);
    });

    let createdBlog: any = null;
    it('should create blog with correct input data', async () => {
        const response = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getBasicAuthHeader())
            .send(blogsMock.correct)
            .expect(201);

        createdBlog = response.body;

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: blogsMock.correct.name,
            description: blogsMock.correct.description,
            websiteUrl: blogsMock.correct.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        });
    });

    // Testing GET /blogs/:id
    it('should return 404 for not existing blog', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/999`)
            .expect(404);
    });

    it('should return existing blog by id', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .expect(200, createdBlog);
    });

    // Testing PUT /blogs/:id
    it('should not update blog that not exist', async () => {
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/999`)
            .set('Authorization', getBasicAuthHeader())
            .send(blogsMock.correct)
            .expect(404);
    });

    it('should not update blog with incorrect input data', async () => {
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set('Authorization', getBasicAuthHeader())
            .send(blogsMock.incorrect)
            .expect(400);
    });

    it('should not update blog with unauthorized user', async () => {
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .send(blogsMock.correct)
            .expect(401);
    });

    it('should update blog with correct input data', async () => {
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set('Authorization', getBasicAuthHeader())
            .send(blogsMock.correct)
            .expect(204);

        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .expect(200, {
                ...createdBlog,
                ...blogsMock.correct
            });
    });

    // Testing DELETE /blogs/:id
    it('should not delete blog with unauthorized user', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .expect(401);
    });

    it('should delete blog with correct input data', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set('Authorization', getBasicAuthHeader())
            .expect(204);

        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .expect(404);
    });
});