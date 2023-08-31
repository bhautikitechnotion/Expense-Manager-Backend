import { collections } from '@src/connections/connections';
import { currentIso, objectId } from '@src/utils';
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