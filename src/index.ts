import express, { Application } from 'express';
import { envSettings } from '@src/utils/env.config';
import cors from 'cors';
import helmet from 'helmet';
import { connectToDb } from './connections';
import userRouter from './services/user/routes';
import categoryRouter from './services/category/routes';
import subCategoryRouter from './services/subCategories/routes';
import expensesRouter from './services/expenses/routes';
import paymentsRouter from './services/payments/routes';
import { isValidHeader } from './middleware/authentication';
import { logger } from './utils/logger';
import session from 'express-session'
import { sessionSecretKey, uri } from './utils';
import MongoDBStore from 'connect-mongodb-session'
import { SESSIONS } from './connections/collections.name';

if (!envSettings.serverPort) {
    process.exit(1);
}

const app: Application = express();

const sessionStore = MongoDBStore(session)

const store = new sessionStore({
    uri,
    collection: SESSIONS
})


app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: sessionSecretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 86400000, secure: true },
    store: store
}))

// Custom Middleware
app.use(isValidHeader);

app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/sub-category', subCategoryRouter);
app.use('/expenses', expensesRouter);
app.use('/payments', paymentsRouter);

app.listen(envSettings.serverPort, async () => {
    logger.info(`Connected to port:${envSettings.serverPort}`);

    await connectToDb();
    console.log(`Server connected successfully to http://localhost:${envSettings.serverPort}`);
});
