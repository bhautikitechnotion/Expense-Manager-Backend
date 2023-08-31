import express from 'express';
import { userRegister, userUpdate } from './controller/user.controller';

const userRouter = express.Router();

//! POST
userRouter.post('/', userRegister);

//! PATCH
userRouter.patch('/:userId', userUpdate);


export default userRouter;
