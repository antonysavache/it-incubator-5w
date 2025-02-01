import {getDb} from "../db/mongo-db";
import {Collection} from "mongodb";

export abstract class AbstractRepository<T> {
    protected collection: Collection<T> | null = null;

    protected constructor(protected collectionName: string) {
    }

    init() {
        if (!this.collection) {
            this.collection = getDb().collection<T>(this.collectionName);
        }
    }

    protected checkInit() {
        if (!this.collection) {
            throw new Error('Repository not initialized');
        }
    }
}