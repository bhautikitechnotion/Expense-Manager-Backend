import { Collection, Db } from 'mongodb';
import { USERS } from './collections.name';
import { collections } from './connections';

export const ConnectToCollections = async (dataBase: Db) => {
    const userCollection: Collection = dataBase.collection(USERS);

    collections.userCollection = userCollection;
};
