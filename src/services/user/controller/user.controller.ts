import { Request, Response } from 'express';
import { isRegisteredEmail, userRegisterModal } from '../modal/user.modal';
import { encryptPassword } from '@src/utils';
import { resMsg } from '@src/utils/response.messages';

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
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};
