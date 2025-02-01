import { app } from './app';
import { runDb } from './shared/db/mongo-db';
import { SETTINGS } from './settings';

async function startApp() {
    try {
        await runDb();
        console.log('Connected to MongoDB');

        app.listen(SETTINGS.PORT, () => {
            console.log(`Server started on port: ${SETTINGS.PORT}`);
        });
    } catch (e) {
        console.log('Server error:', e);
        process.exit(1);
    }
}

startApp();