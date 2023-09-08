import { db, uri } from '@src/utils';
import { Db, MongoClient, MongoClientOptions, MongoServerError } from 'mongodb';
import { ConnectToCollections } from './connectToCollections';
import { logger } from '@src/utils/logger';

const dbClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions);

export async function connectToDb(): Promise<void> {
    try {
        //! Connect to mongodb server
        await dbClient.connect();
        logger.info('MongoDB connected successfully to server');

        //! checking test db connection
        const dataBase: Db = dbClient.db(db);

        //! connect db to collections
        await ConnectToCollections(dataBase);
    } catch (error) {
        //! error
        logger.error(`Error connecting to server => ${(error as MongoServerError).errInfo}`);
    }
}
