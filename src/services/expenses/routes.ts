import express from 'express';
import { createNewExpense } from './controllers/expenses.controller';

const expensesRouter = express.Router();

//! POST request routes
expensesRouter.post('/create', createNewExpense);

export default expensesRouter;
