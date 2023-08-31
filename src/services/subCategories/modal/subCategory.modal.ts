import { collections } from '@src/connections/connections';
import { currentIso, isValidArray, objectId } from '@src/utils';
import { InsertOneResult } from 'mongodb';

interface ReturnResponse {
    update?: boolean;
    success?: boolean;
    data: any;
}
interface CreateSubCategory {
    sub_category_name: string;
    main_category_id: string;
}
export const createNewSubCategoryModal = async (body: CreateSubCategory): Promise<ReturnResponse> => {
    return await new Promise<ReturnResponse>(async(resolve, reject) => {
        try {
            const { sub_category_name, main_category_id } = body;

            const new_body = {
                sub_category_name,
                main_category_id: objectId(main_category_id),
                is_delete: false,
                createdAt: currentIso(),
                updatedAt: currentIso(),
            }

            const res = await collections.subCategoryCollection?.insertOne(new_body, { raw: true}) as InsertOneResult

            const { acknowledged, insertedId } = res

            if(acknowledged){
                resolve({ success: true, data: [{ _id: insertedId, sub_category_name, main_category_id }] })
            }

        } catch (error: any) {
            resolve(error);
        }
    });
};

export const getAllSubCategoriesModal = async (): Promise<ReturnResponse> => {
    return await new Promise<ReturnResponse>( async (resolve, reject) => {
        try {

            const query = [
                {
                    $match: {
                        is_delete: false,
                    }
                },
                {
                    $project: {
                        _id: 1,
                        sub_category_name: 1,
                        main_category_id: 1,
                        is_delete: 1
                    }
                }
            ]

            const res = await collections.subCategoryCollection?.aggregate(query).toArray()

            if(isValidArray(res)){
                resolve({ success: true, data: res})
            }
            
            resolve({ success: false, data: []})
        } catch (error: any) {
            reject(error);
        }
    })
}