import { isValidMongoId } from '@src/utils';
import { resMsg } from '@src/utils/response.messages';
import { Request, Response } from 'express';
import { addNewPaymentMethodModal, getPaymentListByUserIdModal } from '../modal/payments.modal';

interface ReturnResponse {
    message: string;
    success: boolean;
    data: any;
}

export const addNewPaymentMethod = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {

        const { body = {}} = req

        const { payment_method, user_id } = body

        if(!isValidMongoId(user_id)) {
            return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, data: []});
        }

        const new_body: { payment_method: string, user_id: string } = {payment_method, user_id}

        const { success, data } = await addNewPaymentMethodModal(new_body)

        if(success){
            return res.status(200).send({ message: resMsg.PAYMENTS_CREATED_SUCCESSFUL, data: data });
        }

        return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
    } catch (error) {
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
    }
};

export const getPaymentListByUserId = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {

        const { params = {} } = req;

        const { user_id } = params

        if(!isValidMongoId(user_id)){
            return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
        }
        
        const {success, data} = await getPaymentListByUserIdModal(user_id)
        
        if(success){
            return res.status(200).send({ message: resMsg.RECORDS_AVAILABLE, success: true, data: data });
        }

        return res.status(204).send({ message: resMsg.RECORDS_NOT_FOUND, data: [], success: false });
    } catch (error) {
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
}