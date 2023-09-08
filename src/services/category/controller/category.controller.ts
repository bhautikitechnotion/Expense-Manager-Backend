import { resMsg } from '@src/utils/response.messages';
import { Request, Response } from 'express';
import { createCategoryModal, deleteCategoryModal, getAllCategoriesModal, getCategoryByIdModal } from '../modal/category.modal';
import { isValidMongoId } from '@src/utils';
import { logger } from '@src/utils/logger';

interface ReturnResponse {
    message: string;
    data: any[];
    success: boolean;
}

export const createCategory = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { body = {} } = req;

        const { name } = body;

        const new_body: { name: string } = { name };

        const { success: createCategorySuccess, data: createCategoryData } = await createCategoryModal(new_body);

        if (createCategorySuccess) {
            return res.status(200).send({ success: true, data: createCategoryData, message: resMsg.CATEGORY_CREATED_SUCCESSFUL });
        }

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (error: any) {
        logger.error(`createCategory => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { params } = req;

        const { categoryId } = params;

        if (!isValidMongoId(categoryId)) {
            return res.status(200).send({ message: resMsg.CATEGORY_NOT_VALID, data: [], success: false });
        }

        const { update: categoryUpdateSuccess } = await deleteCategoryModal(categoryId);

        if (categoryUpdateSuccess) {
            return res.status(200).send({ message: resMsg.CATEGORY_DELETED_SUCCESSFUL, data: [], success: true });
        }

        return res.status(200).send({ message: resMsg.CATEGORY_NOT_FOUND, data: [], success: false });
    } catch (error: any) {
        logger.error(`deleteCategory => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};

export const getAllCategories = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { success: getAllCategorySuccess, data: allCategoriesData } = await getAllCategoriesModal();

        if (getAllCategorySuccess) {
            return res.status(200).send({ message: resMsg.RECORDS_AVAILABLE, data: allCategoriesData, success: true });
        }

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (error: any) {
        logger.error(`getAllCategories => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { params } = req;
        const { categoryId } = params;

        if (!isValidMongoId(categoryId)) {
            return res.status(200).send({ message: resMsg.CATEGORY_NOT_VALID, data: [], success: false });
        }

        const { success: categoryByIdSuccess, data: categoryByIdData } = await getCategoryByIdModal(categoryId);

        if (categoryByIdSuccess) {
            return res.status(200).send({ message: resMsg.RECORDS_AVAILABLE, data: categoryByIdData, success: true });
        }

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    } catch (error: any) {
        logger.error(`getCategoryById => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, data: [], success: false });
    }
};
