import { Collection, Db } from 'mongodb';
import { CATEGORIES, EXPENSES, PAYMENTS, SUB_CATEGORIES, USERS, USERS_TYPES } from './collections.name';
import { collections } from './connections';

export const ConnectToCollections = async (dataBase: Db) => {
    const userCollection: Collection = dataBase.collection(USERS);
    const usersTypesCollection: Collection = dataBase.collection(USERS_TYPES);
    const categoryCollection: Collection = dataBase.collection(CATEGORIES);
    const subCategoryCollection: Collection = dataBase.collection(SUB_CATEGORIES);
    const expensesCollection: Collection = dataBase.collection(EXPENSES);
    const paymentsCollection: Collection = dataBase.collection(PAYMENTS);
    const sessionsCollection: Collection = dataBase.collection(PAYMENTS);

    collections.userCollection = userCollection;
    collections.usersTypesCollection = usersTypesCollection;
    collections.categoryCollection = categoryCollection;
    collections.subCategoryCollection = subCategoryCollection;
    collections.expensesCollection = expensesCollection;
    collections.paymentsCollection = paymentsCollection;
    collections.sessionsCollection = sessionsCollection;
};
