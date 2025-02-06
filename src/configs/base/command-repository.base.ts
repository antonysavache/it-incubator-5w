import { Filter, ObjectId, UpdateFilter } from "mongodb";
import { AbstractRepository } from "./abstract.repository";

export abstract class BaseCommandRepository<T, CreateModel> extends AbstractRepository<T> {
    async create(data: CreateModel): Promise<string> {
        this.checkInit();

        const result = await this.collection.insertOne(data as any);
        return result.insertedId.toString();
    }

    async update(id: string, data: Partial<CreateModel>): Promise<boolean> {
        this.checkInit();

        if (!ObjectId.isValid(id)) {
            return false;
        }

        const result = await this.collection.updateOne(
            { _id: new ObjectId(id) } as Filter<T>,
            { $set: data } as UpdateFilter<T>
        );

        return result.matchedCount === 1;
    }

    async delete(id: string): Promise<boolean> {
        this.checkInit();

        if (!ObjectId.isValid(id)) {
            return false;
        }

        const result = await this.collection!.deleteOne(
            { _id: new ObjectId(id) } as Filter<T>
        );

        return result.deletedCount === 1;
    }

    async deleteAll(): Promise<void> {
        this.checkInit();
        await this.collection.deleteMany({});
    }
}