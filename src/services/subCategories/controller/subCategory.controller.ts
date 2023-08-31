import { isValidMongoId } from '@src/utils';
import { resMsg } from '@src/utils/response.messages';
import { Request, Response } from 'express';
import { createNewSubCategoryModal, getAllSubCategoriesModal } from '../modal/subCategory.modal';

interface ReturnResponse {
    message: string;
    success: boolean;
    data: any;
}

export const createNewSubCategory = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {

        const { body = {} } = req

        const { sub_category_name, main_category_id } = body

        if(!isValidMongoId(main_category_id)){
            return res.status(200).send({ message: resMsg.MAIN_CATEGORY_NOT_VALID, data: [], success: false });
        }

        const new_body: { sub_category_name: string, main_category_id: string } = { sub_category_name, main_category_id };

        const { success: createSubCategorySuccess, data: createSubCategoryData } = await createNewSubCategoryModal(new_body)


        if(createSubCategorySuccess){
            return res.status(200).send({ message: resMsg.SUB_CATEGORY_CREATED_SUCCESSFUL, data: createSubCategoryData, success: true });
        }


        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (error) {
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};


export const getAllSubCategories = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        

        const { success, data } = await getAllSubCategoriesModal()

        if(success){
            return res.status(200).send({ message: resMsg.RECORDS_AVAILABLE, data: data, success: true });
        }

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (error) {
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
}