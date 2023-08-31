import { collections } from '@src/connections/connections';
import { currentIso, isValidArray, isValidObject, objectId } from '@src/utils';
import { InsertOneResult, ModifyResult } from 'mongodb';

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


export const deleteCategoryModal = async (categoryId: string): Promise<ReturnResponse> => {
    return await new Promise(async (resolve, reject) => {
        try {
            
            const res = await collections.categoryCollection?.findOneAndUpdate({_id: objectId(categoryId), is_deleted: false}, { $set: { is_deleted: true }}, { returnDocument: 'after' } ) as ModifyResult

            const { lastErrorObject, value, ok } = res;

            if(isValidObject(value)){
                resolve({ update: true, data: value})
            }

            resolve({ update: false, data: []})

        } catch (error: any) {
            reject(error);
        }
    })
}

export const getAllCategoriesModal = async (): Promise<ReturnResponse> => {
    return await new Promise(async (resolve, reject) => {
        try {

            const aggregateQuery = [
                {
                    $match: { is_deleted: false }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        is_deleted: 1
                    }
                }
            ]

            const res = await collections.categoryCollection?.aggregate(aggregateQuery).toArray()

            if(isValidArray(res)){
                resolve({ success: true, data: res})
            }

            resolve({ success: false, data: []})
        } catch (error: any) {
            reject(error);
        }
    })
}

export const getCategoryByIdModal = async (cId: string): Promise<ReturnResponse> => {
    return await new Promise(async (resolve, reject) => {
        try {

            const aggregateQuery = [
                {
                    $match: { _id: objectId(cId), is_deleted: false}
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        is_deleted: 1
                    }
                }
            ]
            const res = await collections.categoryCollection?.aggregate(aggregateQuery).toArray()

            if(isValidArray(res)){
                resolve({ success: true, data: res })
            }

            resolve({ success: false, data: [] })
        } catch (error: any) {
            reject(error);
        }
    })
}