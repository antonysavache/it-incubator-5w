import request from 'supertest'
import {app} from "../../app";
import {SETTINGS} from "../../settings";
import {basicAuthMock, blogsMock, getBasicAuthHeader} from "./blogs.mock";


beforeAll(async () => {

    await request(app)
        .delete('/testing/all-data')
        .expect(204)
})

describe('blogs testing', () => {
    describe('GET /blogs', () => {
        it('should return array with created blogs', async () => {
            return request(app)
                .get(SETTINGS.PATH.BLOGS)
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual([])
                })
        })
    })

    describe('POST /blogs', () => {
        describe('20*', ()=> {
            it('201/create blog with the correct data', async () => {
                const createdResponse = await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.correct)
                    .expect(201)

                console.log(createdResponse.body)

                expect(createdResponse.body).toEqual({
                    ...blogsMock.correctCreation,
                    id: expect.any(String),
                    createdAt: expect.any(String)
                })

                const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
                expect(createdResponse.body.createdAt).toMatch(isoDateRegex)
            })
        })

        describe('40*', ()=> {
            it('400/shouldn/t create with incorrect name', async () => {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.incorrectName)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'name'
                            }]
                        })
                    })
            })

            it('400/shouldn/t create with incorrect description', async () => {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.incorrectDescription)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'description'
                            }]
                        })
                    })
            })

            it('400/shouldn/t create with incorrect url', async () => {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.incorrectUrl)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'websiteUrl'
                            }]
                        })
                    })
            })

            it('400/shouldn/t create with all incorrect fields', async () => {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogsMock.incorrect)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: expect.arrayContaining([
                                {
                                    message: expect.any(String),
                                    field: "name"
                                },
                                {
                                    message: expect.any(String),
                                    field: "description"
                                },
                                {
                                    message: expect.any(String),
                                    field: "websiteUrl"
                                }
                            ])
                        })
                        expect(res.body.errorsMessages).toHaveLength(3)
                    })
            })

            it('400/should/t create with url having multiple validation errors', async () => {
                const blogWithBadUrl = {
                    ...blogsMock.correct,
                    websiteUrl: "badurl" + "a".repeat(100)
                }

                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blogWithBadUrl)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'websiteUrl'
                            }]
                        })
                        expect(res.body.errorsMessages).toHaveLength(1)
                    })
            })
        })

        it('401/should not create unauthorized', async () => {
            const createdResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', basicAuthMock.incorrect.login + basicAuthMock.incorrect.password)
                .send(blogsMock.correct)
                .expect(401)

            expect(createdResponse.body).toEqual({})
        })
    })

    describe('GET /blogs/:id', () => {
        let createdBlog: any = null

        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(204)

            const createResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getBasicAuthHeader())
                .send(blogsMock.correct)
                .expect(201)

            createdBlog = createResponse.body
        })

        describe('20*', () => {
            it('200/should return blog by id', async () => {
                const response = await request(app)
                    .get(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .expect(200)

                expect(response.body).toEqual(createdBlog)
            })
        })

        describe('40*', () => {
            it('404/should return if blog not found', async () => {
                await request(app)
                    .get(`${SETTINGS.PATH.BLOGS}/nonexistentid`)
                    .expect(404)
            })
        })
    })

    describe('PUT /blogs/:id', () => {
        let createdBlog: any = null

        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(204)

            const createResponse = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getBasicAuthHeader())
                .send(blogsMock.correct)
                .expect(201)

            createdBlog = createResponse.body
        })

        describe('20*', () => {
            it('204/should update existing blog with correct fields', async () => {
                const updatedData = {
                    name: "Upd Blog Name",
                    description: "Updated Blog Description",
                    websiteUrl: "https://updated.com"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(updatedData)
                    .expect(204)

                const response = await request(app)
                    .get(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .expect(200)

                expect(response.body).toEqual({
                    ...createdBlog,
                    ...updatedData
                })
            })
        })

        describe('40*', () => {
            it('400/If the inputModel has incorrect values', async () => {
                const incorrectData = {
                    name: "",
                    description: "Valid Description",
                    websiteUrl: "https://valid-url.com"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(incorrectData)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'name'
                            }]
                        })
                    })
            })

            it('400/If the inputModel has incorrect URL format', async () => {
                const incorrectUrlData = {
                    name: "Valid Name",
                    description: "Valid Description",
                    websiteUrl: "invalid-url"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(incorrectUrlData)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: [{
                                message: expect.any(String),
                                field: 'websiteUrl'
                            }]
                        })
                    })
            })

            it('400/If the inputModel has all fields incorrect', async () => {
                const allIncorrectData = {
                    name: "",
                    description: "",
                    websiteUrl: "invalid-url"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(allIncorrectData)
                    .expect(400)
                    .expect(res => {
                        expect(res.body).toEqual({
                            errorsMessages: expect.arrayContaining([
                                {
                                    message: expect.any(String),
                                    field: 'name'
                                },
                                {
                                    message: expect.any(String),
                                    field: 'description'
                                },
                                {
                                    message: expect.any(String),
                                    field: 'websiteUrl'
                                }
                            ])
                        })
                        expect(res.body.errorsMessages).toHaveLength(3)
                    })
            })

            it('401/If the user is unauthorized', async () => {
                const updatedData = {
                    name: "Updated Blog Name",
                    description: "Updated Blog Description",
                    websiteUrl: "https://updated.com"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .set('Authorization', basicAuthMock.incorrect.login + basicAuthMock.incorrect.password)
                    .send(updatedData)
                    .expect(401)
            })

            it('404/If the blog does not exist', async () => {
                const updatedData = {
                    name: "Upd Blog Name",
                    description: "Updated Blog Description",
                    websiteUrl: "https://updated.com"
                }

                await request(app)
                    .put(`${SETTINGS.PATH.BLOGS}/nonexistent-id`)
                    .set('Authorization', getBasicAuthHeader())
                    .send(updatedData)
                    .expect(404)
            })
        })
    })

    describe('DELETE /blogs/:id', () => {
        let createdBlog: any = null

        beforeAll(async () => {
            // First clear all data
            await request(app)
                .delete('/testing/all-data')
                .expect(204);

            console.log('Creating test blogs...');

            // Create test blogs with shorter names
            const testBlogs = [
                {
                    name: "Art Blog",
                    description: "Art showcase",
                    websiteUrl: "https://art.com"
                },
                {
                    name: "Tech Blog",
                    description: "Tech reviews",
                    websiteUrl: "https://tech.com"
                },
                {
                    name: "Food Blog",
                    description: "Food reviews",
                    websiteUrl: "https://food.com"
                },
                {
                    name: "Travel Blog",
                    description: "Travel tips",
                    websiteUrl: "https://travel.com"
                },
                {
                    name: "News Blog",
                    description: "Daily news",
                    websiteUrl: "https://news.com"
                }
            ];

            // Create each blog
            for (const blog of testBlogs) {
                await request(app)
                    .post('/blogs')
                    .set('Authorization', getBasicAuthHeader())
                    .send(blog);
            }
        });

        describe('20*', () => {
            it('204/should delete existing blog', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .set('Authorization', getBasicAuthHeader())
                    .expect(204)

                await request(app)
                    .get(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .expect(404)
            }, 10000)
        })

        describe('40*', () => {
            it('401/should not delete blog if unauthorized', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog._id}`)
                    .set('Authorization', basicAuthMock.incorrect.login + basicAuthMock.incorrect.password)
                    .expect(401)
            })

            it('404/should not delete non-existent blog', async () => {
                await request(app)
                    .delete(`${SETTINGS.PATH.BLOGS}/nonexistent-id`)
                    .set('Authorization', getBasicAuthHeader())
                    .expect(404)
            })
        })
    })

    describe('Blogs pagination, sorting and search tests', () => {
        const basicAuthCredentials = {
            login: 'admin',
            password: 'qwerty'
        };

        const getBasicAuthHeader = () => {
            return `Basic ${Buffer.from(`${basicAuthCredentials.login}:${basicAuthCredentials.password}`).toString('base64')}`;
        };

        const testBlogs = [
            { name: "Art Blog", description: "Art posts", websiteUrl: "https://art.com" },
            { name: "Tech Blog", description: "Tech news", websiteUrl: "https://tech.com" },
            { name: "Food Blog", description: "Recipes", websiteUrl: "https://food.com" },
            { name: "Travel Blog", description: "Travel stories", websiteUrl: "https://travel.com" },
            { name: "Music Blog", description: "Music reviews", websiteUrl: "https://music.com" }
        ];

        beforeAll(async () => {
            // Clear DB
            await request(app)
                .delete('/testing/all-data')
                .expect(204);

            // Create test blogs
            for (const blog of testBlogs) {
                await request(app)
                    .post(SETTINGS.PATH.BLOGS)
                    .set('Authorization', getBasicAuthHeader())
                    .send(blog)
                    .expect(201);
            }

            console.log('Test data created');
        });

        describe('Basic Pagination Tests', () => {
            it('should return first page with default pagination', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .expect(200);

                expect(response.body).toEqual({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 5,
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            name: expect.any(String)
                        })
                    ])
                });
                expect(response.body.items).toHaveLength(5);
            });

            it('should return correct page size when specified', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ pageSize: 2 })
                    .expect(200);

                expect(response.body.items).toHaveLength(2);
                expect(response.body.pageSize).toBe(2);
                expect(response.body.totalCount).toBe(5);
            });

            it('should return correct page when pageNumber specified', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ pageSize: 2, pageNumber: 2 })
                    .expect(200);

                expect(response.body.items).toHaveLength(2);
                expect(response.body.page).toBe(2);
            });

            it('should handle last page with fewer items', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ pageSize: 2, pageNumber: 3 })
                    .expect(200);

                expect(response.body.items).toHaveLength(1);
                expect(response.body.page).toBe(3);
            });
        });

        describe('Sorting Tests', () => {
            it('should sort by name in ascending order', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ sortBy: 'name', sortDirection: 'asc' })
                    .expect(200);

                const names = response.body.items.map(item => item.name);
                expect(names).toEqual([...names].sort());
            });

            it('should sort by name in descending order', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ sortBy: 'name', sortDirection: 'desc' })
                    .expect(200);

                const names = response.body.items.map(item => item.name);
                expect(names).toEqual([...names].sort().reverse());
            });

            it('should sort by createdAt by default', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .expect(200);

                const dates = response.body.items.map(item => new Date(item.createdAt).getTime());
                const sortedDates = [...dates].sort((a, b) => b - a);
                expect(dates).toEqual(sortedDates);
            });
        });

        describe('Search Tests', () => {
            it('should return filtered results when searchNameTerm is provided', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ searchNameTerm: 'Tech' })
                    .expect(200);

                expect(response.body.items).toHaveLength(1);
                expect(response.body.items[0].name).toContain('Tech');
            });

            it('should handle case-insensitive search', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ searchNameTerm: 'blog' })
                    .expect(200);

                expect(response.body.items.length).toBeGreaterThan(0);
                response.body.items.forEach(item => {
                    expect(item.name.toLowerCase()).toContain('blog');
                });
            });

            it('should return empty array for non-matching search', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ searchNameTerm: 'NonExistentBlog' })
                    .expect(200);

                expect(response.body.items).toHaveLength(0);
                expect(response.body.totalCount).toBe(0);
            });
        });

        describe('Combined Functionality Tests', () => {
            it('should handle search with pagination', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({
                        searchNameTerm: 'Blog',
                        pageSize: 2,
                        pageNumber: 1
                    })
                    .expect(200);

                expect(response.body.items).toHaveLength(2);
                expect(response.body.pageSize).toBe(2);
                response.body.items.forEach(item => {
                    expect(item.name.toLowerCase()).toContain('blog');
                });
            });

            it('should handle search with sorting', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({
                        searchNameTerm: 'Blog',
                        sortBy: 'name',
                        sortDirection: 'asc'
                    })
                    .expect(200);

                const names = response.body.items.map(item => item.name);
                const sortedNames = [...names].sort();
                expect(names).toEqual(sortedNames);
                names.forEach(name => {
                    expect(name.toLowerCase()).toContain('blog');
                });
            });

            it('should handle sorting with pagination', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({
                        sortBy: 'name',
                        sortDirection: 'asc',
                        pageSize: 2,
                        pageNumber: 1
                    })
                    .expect(200);

                expect(response.body.items).toHaveLength(2);
                const names = response.body.items.map(item => item.name);
                const sortedNames = [...names].sort();
                expect(names).toEqual(sortedNames);
            });

            it('should handle all query params together', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({
                        searchNameTerm: 'Blog',
                        sortBy: 'name',
                        sortDirection: 'asc',
                        pageSize: 2,
                        pageNumber: 1
                    })
                    .expect(200);

                expect(response.body.items).toHaveLength(2);
                expect(response.body.pageSize).toBe(2);
                expect(response.body.page).toBe(1);

                const names = response.body.items.map(item => item.name);
                const sortedNames = [...names].sort();
                expect(names).toEqual(sortedNames);

                names.forEach(name => {
                    expect(name.toLowerCase()).toContain('blog');
                });
            });
        });

        describe('Error Handling Tests', () => {
            it('should handle invalid pageNumber gracefully', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ pageNumber: 'invalid' })
                    .expect(200);

                expect(response.body.page).toBe(1); // Should use default
            });

            it('should handle invalid pageSize gracefully', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ pageSize: 'invalid' })
                    .expect(200);

                expect(response.body.pageSize).toBe(10); // Should use default
            });

            it('should handle invalid sortDirection gracefully', async () => {
                const response = await request(app)
                    .get(SETTINGS.PATH.BLOGS)
                    .query({ sortDirection: 'invalid' })
                    .expect(200);

                expect(response.body.items).toBeDefined();
            });
        });
    });
})