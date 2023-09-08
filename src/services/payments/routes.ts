import express from 'express';
import { addNewPaymentMethod, getPaymentListByUserId } from './controller/payments.controller';

const paymentsRouter = express.Router();

//! GET request routes
paymentsRouter.get('/payment_list/:user_id', getPaymentListByUserId);

//! POST request routes
paymentsRouter.post('/', addNewPaymentMethod);

export default paymentsRouter;
