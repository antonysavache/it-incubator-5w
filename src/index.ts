import { app } from './app';
import { runDb } from './shared/db/mongo-db';
import { SETTINGS } from './settings';
import {
    blogsCommandRepository,
    blogsQueryRepository,
    postsCommandRepository,
    postsQueryRepository
} from "./shared/composition-root";

export async function startApp() {
    try {
        await runDb();
        console.log('Connected to MongoDB');

        blogsQueryRepository.init();
        blogsCommandRepository.init();
        postsQueryRepository.init();
        postsCommandRepository.init();

        app.listen(SETTINGS.PORT, () => {
            console.log(`Server started on port: ${SETTINGS.PORT}`);
        });
    } catch (e) {
        console.log('Server error:', e);
        process.exit(1);
    }
}

startApp();