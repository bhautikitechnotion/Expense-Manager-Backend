import express from 'express';
import { userLogin, userRegister, userUpdate } from './controller/user.controller';

const userRouter = express.Router();

//! POST
userRouter.post('/', userRegister);
userRouter.post('/login', userLogin);

//! PATCH
userRouter.patch('/:userId', userUpdate);


export default userRouter;
