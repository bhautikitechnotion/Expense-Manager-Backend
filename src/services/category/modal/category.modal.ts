import { collections } from '@src/connections/connections';
import { currentIso } from '@src/utils';
import { InsertOneResult } from 'mongodb';

interface ReturnResponse {
    update?: boolean;
    success?: boolean;
    data: any;
}

export const createCategoryModal = async (body: { name: string }): Promise<ReturnResponse> => {
    return await new Promise(async (resolve, reject) => {
        try {
            const new_body = {
                ...body,
                is_deleted: false,
                createdAt: currentIso(),
                updatedAt: currentIso(),
            };

            const res = (await collections.categoryCollection?.insertOne(new_body, { raw: true })) as InsertOneResult;

            const { acknowledged, insertedId } = res;

            if (acknowledged) {
                return resolve({
                    success: true,
                    data: [{ name: new_body.name, _id: insertedId }],
                });
            }
            return resolve({ success: false, data: [] });
        } catch (error) {
            return reject(error);
        }
    });
};
