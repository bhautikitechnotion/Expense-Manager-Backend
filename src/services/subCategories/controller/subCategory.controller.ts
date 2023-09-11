import { isValidMongoId } from '@src/utils';
import { resMsg } from '@src/utils/response.messages';
import { Request, Response } from 'express';
import {
    createNewSubCategoryModal,
    getAllSubCategoriesModal,
    getSubCategoryByIdModal,
    getSubCategoryListByMainCategoryModal,
} from '../modal/subCategory.modal';
import { logger } from '@src/utils/logger';

interface ReturnResponse {
    message: string;
    success: boolean;
    data: any;
}

export const createNewSubCategory = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { body = {} } = req;

        const { sub_category_name, main_category_id } = body;

        if (!isValidMongoId(main_category_id)) {
            return res.status(200).send({ message: resMsg.MAIN_CATEGORY_NOT_VALID, data: [], success: false });
        }

        const new_body: { sub_category_name: string; main_category_id: string } = {
            sub_category_name,
            main_category_id,
        };

        const { success: createSubCategorySuccess, data: createSubCategoryData } = await createNewSubCategoryModal(new_body);

        if (createSubCategorySuccess) {
            return res.status(200).send({ message: resMsg.SUB_CATEGORY_CREATED_SUCCESSFUL, data: createSubCategoryData, success: true });
        }

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (error: any) {
        logger.error(`createNewSubCategory => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};

export const getAllSubCategories = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { success, data } = await getAllSubCategoriesModal();

        if (success) {
            return res.status(200).send({ message: resMsg.RECORDS_AVAILABLE, data: data, success: true });
        }

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (error: any) {
        logger.error(`getAllSubCategories => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};

export const getSubCategoryById = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { params = {} } = req;
        const { sub_category_id } = params;

        if (!isValidMongoId(sub_category_id)) {
            return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
        }

        const { success, data } = await getSubCategoryByIdModal(sub_category_id);

        if (success) {
            return res.status(200).send({ message: resMsg.RECORDS_AVAILABLE, data: data, success: true });
        }

        return res.status(200).send({ message: resMsg.RECORDS_NOT_FOUND, data: [], success: false });
    } catch (error: any) {
        logger.error(`getSubCategoryById => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};

export const getSubCategoryListByMainCategory = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { params = {} } = req;
        const { main_category_id } = params;

        if (!isValidMongoId(main_category_id)) {
            return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
        }

        const { success, data } = await getSubCategoryListByMainCategoryModal(main_category_id);

        if (success) {
            return res.status(200).send({ message: resMsg.RECORDS_AVAILABLE, data: data, success: true });
        }

        return res.status(200).send({ message: resMsg.RECORDS_NOT_FOUND, data: [], success: false });
    } catch (error: any) {
        logger.error(`getSubCategoryListByMainCategory => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};
