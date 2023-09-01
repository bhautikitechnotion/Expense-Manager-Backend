import { Collection } from 'mongodb';

export const collections: {
    userCollection?: Collection;
    categoryCollection?: Collection;
    subCategoryCollection?: Collection;
    expensesCollection?: Collection;
    paymentsCollection?: Collection;
} = {};
