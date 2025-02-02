import {runDb} from "./src/shared/db/mongo-db";
import {
    blogsCommandRepository,
    blogsQueryRepository,
    postsCommandRepository,
    postsQueryRepository
} from "./src/shared/composition-root";

beforeAll(async () => {
    await runDb();

    blogsQueryRepository.init();
    blogsCommandRepository.init();
    postsQueryRepository.init();
    postsCommandRepository.init();
})