import { collections } from '@src/connections/connections';
import { isValidObject, currentIso } from '@src/utils';
import { InsertOneResult } from 'mongodb';

interface ReturnResponse {
    update?: boolean;
    success?: boolean;
    data: any[];
}

export const isRegisteredEmail = async (email: string): Promise<ReturnResponse> => {
    return await new Promise(async (resolve, reject) => {
        try {
            const res = await collections.userCollection?.findOne({ email: email, is_deleted: false });

        if (isValidObject(res)) {
            return resolve({ success: true, data: [res] });
        }
        return resolve({ success: false, data: [] });
        } catch (error) {
            return reject(error);
        }
        
    });
};

interface userRegisterModal{
    full_name: string;
    password: string;
    email: string;
}

export const userRegisterModal = async (body: userRegisterModal): Promise<ReturnResponse> => {
    return await new Promise(async (resolve, reject) => {
        try {

            const new_body = {
                ...body,
                is_deleted: false,
                createdAt: currentIso(),
                updatedAt: currentIso()
            }

            const res = await collections.userCollection?.insertOne(new_body, { raw: true }) as InsertOneResult;

            const { acknowledged, insertedId } = res

            if(acknowledged){
                return resolve({ success: true, data:[{ full_name: new_body.full_name, email: new_body.email, _id: insertedId }]});
            }

        return resolve({ success: false, data: [] });
        } catch (error) {
            return reject(error);
        }
    });
};
