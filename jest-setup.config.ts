import {runDb} from "./src/shared/db/mongo-db";
import {blogsCommandRepository, blogsQueryRepository} from "./src/features/blogs/blogs.composition";
import {postsCommandRepository, postsQueryRepository} from "./src/features/posts/posts.composition";

beforeAll(async () => {
    await runDb();

    blogsQueryRepository.init();
    blogsCommandRepository.init();
    postsQueryRepository.init();
    postsCommandRepository.init();
})