import express from 'express';
import { createNewExpense, deleteAExpense } from './controllers/expenses.controller';

const expensesRouter = express.Router();

//! POST request routes
expensesRouter.post('/create', createNewExpense);

//! DELETE request routes
expensesRouter.delete('/:expense_id', deleteAExpense);

export default expensesRouter;
