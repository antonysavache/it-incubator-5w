import { MongoClient } from "mongodb"
import {SETTINGS} from "../../settings";

let client: MongoClient

export async function runDb() {
    try {
        client = new MongoClient(SETTINGS.DB_URL)
        await client.connect()
        await client.db().command({ ping: 1 })
        console.log("Connected successfully to mongo server")
        return true
    } catch (e) {
        console.log("Can't connect to db")
        await client?.close()
        return false
    }
}

export function getDb() {
    if (!client) {
        throw new Error('Database not initialized')
    }
    return client.db(SETTINGS.DB_NAME)
}