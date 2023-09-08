import { isValidMongoId } from '@src/utils';
import { resMsg } from '@src/utils/response.messages';
import { Request, Response } from 'express';
import { createNewExpenseModal, deleteAExpenseModal } from '../modal/expenses.modal';
import { logger } from '@src/utils/logger';

interface ReturnResponse {
    message: string;
    success: boolean;
    data: any[];
}

interface CreateNewExpense {
    amount: number;
    expense_date: string;
    payment_method: string;
    user_id: string;
    description: string;
    main_category: string;
    sub_category: string;
}
export const createNewExpense = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { body = {} } = req;

        const { amount, expense_date, payment_method, user_id, description, main_category, sub_category } = body;

        if (!isValidMongoId(user_id) || !isValidMongoId(main_category) || !isValidMongoId(sub_category) || !isValidMongoId(payment_method)) {
            return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
        }

        const new_body: CreateNewExpense = { amount, expense_date, payment_method, user_id, description, main_category, sub_category };

        const { success, data } = await createNewExpenseModal(new_body);

        if (success) {
            return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, success: true, data: data });
        }

        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
    } catch (error: any) {
        logger.error(`createNewExpense => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
    }
};

export const deleteAExpense = async (req: Request, res: Response): Promise<Response<ReturnResponse>> => {
    try {
        const { params = {} } = req;
        const { expense_id } = params;

        if (!isValidMongoId(expense_id)) {
            return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
        }

        const { success, data } = await deleteAExpenseModal(expense_id);

        if (success) {
            return res.status(200).send({ message: resMsg.EXPENSES_DELETED_SUCCESSFUL, success: true, data: data });
        }

        return res.status(200).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
    } catch (error: any) {
        logger.error(`deleteAExpense => ${error.message}`);
        return res.status(204).send({ message: resMsg.SOMETHING_WENT_WRONG, success: false, data: [] });
    }
};
