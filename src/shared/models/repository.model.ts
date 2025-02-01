export interface DatabaseCollection<T> {
    find(filter: any): Promise<T[]>;
    findOne(filter: any): Promise<T | null>;
    insertOne(data: any): Promise<any>;
    updateOne(filter: any, data: any): Promise<boolean>;
    deleteOne(filter: any): Promise<boolean>;
    deleteMany(filter: any): Promise<void>;
    countDocuments(filter?: any): Promise<number>;
}