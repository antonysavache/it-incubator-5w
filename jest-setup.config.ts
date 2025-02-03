import {runDb} from "./src/shared/db/mongo-db";
import {
    blogsCommandRepository,
    blogsQueryRepository,
    postsCommandRepository,
    postsQueryRepository, usersCommandRepository, usersQueryRepository
} from "./src/configs/composition-root";

beforeAll(async () => {
    await runDb();

    blogsQueryRepository.init();
    blogsCommandRepository.init();
    postsQueryRepository.init();
    postsCommandRepository.init();
    usersCommandRepository.init();
    usersQueryRepository.init();
})