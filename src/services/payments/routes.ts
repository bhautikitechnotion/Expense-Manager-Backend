import express from 'express';
import { addNewPaymentMethod } from './controller/payments.controller';

const paymentsRouter = express.Router();

//! POST request routes
paymentsRouter.post('/', addNewPaymentMethod);

export default paymentsRouter;
