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

if (!envSettings.serverPort) {
    process.exit(1);
}

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

// Custom Middleware
app.use(isValidHeader)

app.use('/user', userRouter)
app.use('/category', categoryRouter)
app.use('/sub-category', subCategoryRouter)
app.use('/expenses', expensesRouter)
app.use('/payments', paymentsRouter)

app.listen(envSettings.serverPort, async () => {
    console.log(`Connecting to server at port ${envSettings.serverPort}`)

    await connectToDb()
})