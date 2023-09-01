import { collections } from '@src/connections/connections';
import { currentIso, isValidObject, objectId } from '@src/utils';
import { InsertOneResult, ModifyResult } from 'mongodb';

interface ReturnResponse {
    update?: boolean;
    success?: boolean;
    data: any;
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

export const createNewExpenseModal = async (body: CreateNewExpense): Promise<ReturnResponse> => {
    return await new Promise<ReturnResponse>(async(resolve, reject) => {
        try {
            const {payment_method, user_id, main_category, sub_category, ...rest} = body

            const new_body = {
                ...rest,
                payment_method: objectId(payment_method),
                user_id: objectId(user_id),
                main_category: objectId(main_category),
                sub_category: objectId(sub_category),
                is_deleted: false,
                createdAt: currentIso(),
                updatedAt: currentIso(),
            }

            const res = await collections.expensesCollection?.insertOne(new_body, { raw: true }) as InsertOneResult

            const { acknowledged, insertedId } = res;

            if (acknowledged) {
                resolve({ success: true, data: [{ _id: insertedId, amount: new_body.amount, expense_date: new_body.expense_date, description: new_body.description  }] })
            }

            resolve({ success: false, data: [] })

        } catch (error: any) {
            reject(error);
        }
    })
};

export const deleteAExpenseModal = async (expense_id: string): Promise<ReturnResponse>  => {
    return await new Promise( async (resolve, reject) => {
        try {
            const res = await collections.expensesCollection?.findOneAndUpdate({ _id: objectId(expense_id), is_deleted: false }, { $set: { is_deleted: true }}, { returnDocument: "after" }) as ModifyResult

            const { value } = res;

            if(isValidObject(value)) {
                resolve({ success: true, data: []})
            }

            resolve({ success: false, data: []})

        } catch (error) {
            reject(error);
        }
    })
}