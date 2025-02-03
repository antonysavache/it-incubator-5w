import { app } from './app';
import { runDb } from './shared/db/mongo-db';
import { SETTINGS } from './configs/settings';
import {
    blogsCommandRepository,
    blogsQueryRepository,
    postsCommandRepository,
    postsQueryRepository, usersCommandRepository, usersQueryRepository
} from "./configs/composition-root";

async function startApp() {
    try {
        await runDb();
        console.log('Connected to MongoDB');

        blogsQueryRepository.init();
        blogsCommandRepository.init();
        postsQueryRepository.init();
        postsCommandRepository.init();
        usersQueryRepository.init();
        usersCommandRepository.init();

        app.listen(SETTINGS.PORT, () => {
            console.log(`Server started on port: ${SETTINGS.PORT}`);
        });
    } catch (e) {
        console.log('Server error:', e);
        process.exit(1);
    }
}

startApp();