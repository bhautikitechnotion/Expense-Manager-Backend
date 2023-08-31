import { collections } from '@src/connections/connections';
import { currentIso, objectId } from '@src/utils';
import { InsertOneResult } from 'mongodb';

interface ReturnResponse {
    update?: boolean;
    success?: boolean;
    data: any;
}
interface NewExpense {
    payment_method: string;
    user_id: string;
}

export const addNewPaymentMethodModal = async (body: NewExpense): Promise<ReturnResponse> => {
    return await new Promise( async (resolve, reject) => {
        try {
            const { payment_method, user_id } = body;

            const new_body = {
                payment_method,
                user_id: objectId(user_id),
                is_deleted: false,
                createdAt: currentIso(),
                updatedAt: currentIso(),
            };

            const res = await collections.paymentsCollection?.insertOne(new_body, { raw: true }) as InsertOneResult;

            const { acknowledged, insertedId } = res;

            if(acknowledged) {
                resolve({ success: true, data: {_id: insertedId, payment_method, user_id  } })
            }
            
            resolve({ success: false, data: [] })
            

        } catch (error: any) {
            reject(error);
        }
    });
};
