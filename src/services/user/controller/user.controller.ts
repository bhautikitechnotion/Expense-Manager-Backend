import { Request, Response } from 'express';
import { isRegisteredEmail, userRegisterModal, userUpdateModal } from '../modal/user.modal';
import { decryptPassword, encryptPassword } from '@src/utils';
import { resMsg } from '@src/utils/response.messages';
import { logger } from '@src/utils/logger';

interface ReturnResponse {
    message: string;
    data: any[];
    success: boolean;
}

export const userRegister = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { body = {} } = req;

        const { full_name, password, email } = body;

        const { success: registeredEmailSuccess } = await isRegisteredEmail(email);

        if (registeredEmailSuccess) {
            return res.send({ message: resMsg.ALREADY_USER_REGISTERED, data: [], success: false });
        }

        const { success, hashPassword } = encryptPassword(password);

        if(!success) throw new Error('Please send valid password')

        const new_body: {full_name: string, password: string, email: string} = {full_name, password: hashPassword, email}

        const {success: userRegisterSuccess, data: userRegisterData} = await userRegisterModal(new_body)

        if(userRegisterSuccess) {
            return res.status(200).send({ message: resMsg.USER_REGISTRATION_SUCCESSFUL, data: userRegisterData, success: true });
        }

        

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (err: any) {
        logger.error(`userRegister => ${err.message}`)
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};

export const userUpdate = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { body = {}, params = {} } = req;

        const { full_name, email } = body;
        const { userId } = params;

        const { success: registeredEmailSuccess } = await isRegisteredEmail(email);

        if (!registeredEmailSuccess) {
            return res.send({ message: resMsg.USER_NOT_REGISTERED, data: [], success: false });
        }

        const new_body: {full_name: string, email: string, id: string} = {full_name, email, id: userId}

        const {update: userUpdateSuccess, data: userUpdateData} = await userUpdateModal(new_body)

        if(userUpdateSuccess){
            return res.status(200).send({ message: resMsg.USER_UPDATED_SUCCESSFUL, data: userUpdateData, success: true });
        }
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (err: any) {
        logger.error(`userUpdate => ${err.message}`)
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
}

export const userLogin = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {

        const { body = {}} = req;

        const { email, password } = body;

        // check if email is registered already in the database
        const { success: registeredEmailSuccess, data } = await isRegisteredEmail(email);

        if(!registeredEmailSuccess){
            return res.send({ message: resMsg.USER_NOT_REGISTERED, success: false, data: []})
        }

        const [{ _id: user_id, password: userHashPassword, token }] = data;

        // check if password is correct or not for given email
        const { success: passwordSuccess } = decryptPassword(password, userHashPassword);

        if(!passwordSuccess){
            return res.send({ message: resMsg.USER_PASSWORD_WRONG, success: false, data: []})
        }
        console.log("🚀 ~ file: user.controller.ts:87 ~ userLogin ~ passwordSuccess:", passwordSuccess)



        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (error: any) {
        logger.error(`userLogin => ${error.message}`)
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
}