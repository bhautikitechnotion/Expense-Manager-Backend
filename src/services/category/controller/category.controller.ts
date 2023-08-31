import { resMsg } from '@src/utils/response.messages';
import { Request, Response } from 'express';
import { createCategoryModal } from '../modal/category.modal';

interface ReturnResponse {
    message: string;
    data: any[];
    success: boolean;
}

export const createCategory = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {

        const { body = {} } = req;

        const { name } = body

        const new_body: {name: string} = { name }

        const {success: createCategorySuccess, data: createCategoryData } = await createCategoryModal(new_body)

        if(createCategorySuccess){
            return res.status(200).send({success: true, data: createCategoryData, message: resMsg.CATEGORY_CREATED_SUCCESSFUL})
        }

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (err: any) {
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};
