import express from 'express';
import { userRegister } from './controller/user.controller';

const userRouter = express.Router();

//! POST
userRouter.post('/register', userRegister);

export default userRouter;
