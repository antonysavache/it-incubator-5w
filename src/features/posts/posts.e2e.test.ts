import request from "supertest";
import {app} from "../../app";
import {SETTINGS} from "../../configs/settings";
import {blogsMock, getBasicAuthHeader} from "../blogs/blogs.mock";
import {postsMock} from "./posts.mock";

describe('posts testing', () => {
    let createdBlog: any = null;

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204);

        const response = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getBasicAuthHeader())
            .send(blogsMock.correct)
            .expect(201);

        createdBlog = response.body;
    });

    // GET /posts
    it('should return empty array', async () => {
        await request(app)
            .get(SETTINGS.PATH.POSTS)
            .expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
    });

    // POST /posts
    it('should not create post with incorrect input data', async () => {
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', getBasicAuthHeader())
            .send({
                ...postsMock.correct,
                title: ''
            })
            .expect(400);
    });

    it('should not create post with unauthorized user', async () => {
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .send({
                ...postsMock.correct,
                blogId: createdBlog.id
            })
            .expect(401);
    });

    let createdPost: any = null;
    it('should create post with correct input data', async () => {
        const response = await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', getBasicAuthHeader())
            .send({
                ...postsMock.correct,
                blogId: createdBlog.id
            })
            .expect(201);

        createdPost = response.body;

        expect(createdPost).toEqual({
            id: expect.any(String),
            title: postsMock.correct.title,
            shortDescription: postsMock.correct.shortDescription,
            content: postsMock.correct.content,
            blogId: createdBlog.id,
            blogName: createdBlog.name,
            createdAt: expect.any(String)
        });
    });

    // GET /posts/:id
    it('should return 404 for not existing post', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/999`)
            .expect(404);
    });

    it('should return existing post by id', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(200, createdPost);
    });

    // PUT /posts/:id
    it('should not update post that not exist', async () => {
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/999`)
            .set('Authorization', getBasicAuthHeader())
            .send({
                ...postsMock.correct,
                blogId: createdBlog.id
            })
            .expect(404);
    });

    it('should not update post with incorrect input data', async () => {
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set('Authorization', getBasicAuthHeader())
            .send({
                ...postsMock.correct,
                title: '',
                blogId: createdBlog.id
            })
            .expect(400);
    });

    it('should not update post with unauthorized user', async () => {
        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .send({
                ...postsMock.correct,
                blogId: createdBlog.id
            })
            .expect(401);
    });

    it('should update post with correct input data', async () => {
        const updateData = {
            ...postsMock.correct,
            title: 'Updated title',
            blogId: createdBlog.id
        };

        await request(app)
            .put(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set('Authorization', getBasicAuthHeader())
            .send(updateData)
            .expect(204);

        const response = await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(200);

        expect(response.body).toEqual({
            ...createdPost,
            title: updateData.title
        });
    });

    // DELETE /posts/:id
    it('should not delete post with unauthorized user', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(401);
    });

    it('should delete post with correct input data', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .set('Authorization', getBasicAuthHeader())
            .expect(204);

        await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}`)
            .expect(404);
    });
});