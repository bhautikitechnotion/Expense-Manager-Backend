import { Collection } from 'mongodb';

export const collections: {
    userCollection?: Collection;
    usersTypesCollection?: Collection;
    categoryCollection?: Collection;
    subCategoryCollection?: Collection;
    expensesCollection?: Collection;
    paymentsCollection?: Collection;
    sessionsCollection?: Collection;
} = {};
