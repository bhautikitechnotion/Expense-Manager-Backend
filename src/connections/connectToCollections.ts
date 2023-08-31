import { Collection, Db } from 'mongodb';
import { CATEGORIES, EXPENSES, SUB_CATEGORIES, USERS } from './collections.name';
import { collections } from './connections';

export const ConnectToCollections = async (dataBase: Db) => {
    const userCollection: Collection = dataBase.collection(USERS);
    const categoryCollection: Collection = dataBase.collection(CATEGORIES);
    const subCategoryCollection: Collection = dataBase.collection(SUB_CATEGORIES);
    const expensesCollection: Collection = dataBase.collection(EXPENSES);

    collections.userCollection = userCollection;
    collections.categoryCollection = categoryCollection;
    collections.subCategoryCollection = subCategoryCollection;
    collections.expensesCollection = expensesCollection;
};
