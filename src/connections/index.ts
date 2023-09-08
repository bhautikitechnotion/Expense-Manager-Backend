import { db, uri } from '@src/utils';
import { Db, MongoClient, MongoClientOptions, MongoServerError } from 'mongodb';
import { ConnectToCollections } from './connectToCollections';

const dbClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions);

export async function connectToDb(): Promise<void> {
    try {
        await dbClient.connect();

        const dataBase: Db = dbClient.db(db);

        await ConnectToCollections(dataBase);
    } catch (error) {
        console.log((error as MongoServerError).message);
    }
}
