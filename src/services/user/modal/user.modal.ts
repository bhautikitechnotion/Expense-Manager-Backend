import { collections } from '@src/connections/connections';
import { isValidObject, currentIso, objectId, isValidArray } from '@src/utils';
import { logger } from '@src/utils/logger';
import { InsertOneResult, ModifyResult } from 'mongodb';

interface ReturnResponse {
    update?: boolean;
    success?: boolean;
    data: any[];
}

interface UpdateRes {
    lastErrorObject: any,
    ok: number,
    value: any
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
                type: 2,
                token: null,
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

interface userUpdateModal{
    full_name: string;
    email: string;
    id: string;
}

export const userUpdateModal = async (body: userUpdateModal): Promise<ReturnResponse> => {
    return await new Promise(async (resolve, reject) => {
        try {
            const { id, ...rest_body} = body
            const new_body = {
                ...rest_body,
                updatedAt: currentIso()
            }

            const res = await collections.userCollection?.findOneAndUpdate({ _id: objectId(id), is_deleted: false }, { $set: new_body }, { returnDocument: 'after', projection: { full_name: 1, email: 1 } })

            const { lastErrorObject, ok, value = {} } = res as UpdateRes;

            if(isValidObject(value)){
                return resolve({ update: true, data: [value] })
            }
            return resolve({ update: false, data: [] })
            
        } catch (error) {
            return reject(error);
        }
    })
}

export const getUserTokenByUserEmail = async (email: string): Promise<ReturnResponse> => {
    return await new Promise<ReturnResponse>( async (resolve, reject) => {
        try {
            
            const res: any = await collections.userCollection?.findOne(
                {
                    email: email, is_deleted: false
                },
                {
                    projection: { full_name: 1, email: 1, token: 1 },
                }
            )

            if(isValidArray(res)){
                const { token } = res
                if(token) {
                    return resolve({ success: true, data: [res]})
                }
            }

            return resolve({ success: false, data: []})

        } catch (error: any) {
            logger.error(`getUserTokenByUserEmail => ${error.message}`)
            return reject({ success: false, data: []})
        }
    })
}

interface TokenTypes{
    access_token: string,
    refresh_token: string
}
export const updateUserTokenByEmail = async (email: string, options: TokenTypes): Promise<ReturnResponse> => {
    return await new Promise<ReturnResponse>( async (resolve, reject) => {
        try {
            
            const res = await collections.userCollection?.findOneAndUpdate( { email: email, is_deleted: false }, { $set: { token: options } }, { returnDocument: "after", projection: { token: 1, _id: 1, full_name: 1 } } )

            const { lastErrorObject, ok, value = {} } = res as UpdateRes;

            if (isValidObject(value)) {
                return resolve({ update: true, data: [value] });
            }
            return resolve({ update: false, data: [] });

        } catch (error: any) {
            logger.error(`updateUserTokenByEmail => ${error.message}`)
            reject({ update: false, data: [] })
        }
    })
}

interface UserLogoutByTokenExpired {
    userId: string,
    // token: string
}
export const updateUserLogoutByTokenExpired = async (details: UserLogoutByTokenExpired): Promise<ReturnResponse> => {
    return await new Promise<ReturnResponse>(async (resolve, reject) => {
        try {

            const { userId } = details;

            const res = await collections.userCollection?.findOneAndUpdate(
                {_id: objectId(userId), is_deleted: false},
                [{ $set: { token: { access_token: null } } }],
                { returnDocument: 'after', projection: { token: 1, email: 1, _id: 1, full_name: 1 } },
            ) as ModifyResult

            const { lastErrorObject, ok, value = {} } = res as UpdateRes;

            if (isValidObject(value)) {
                return resolve({ update: true, data: [value] })
            }

            return resolve({ update: false, data: [] })
        } catch (error: any) {
            logger.error(`updateUserLogoutByTokenExpired => ${error.message}`)
            reject(error)
        }
    })
}

export const isRegisteredEmailAndToken = async (email: string, token: string): Promise<ReturnResponse> => {
    return await new Promise<ReturnResponse>( async (resolve, reject) => {
        try {

            const query = { 
                email: email, 'token.access_token': token, is_deleted: false
            }
            
            const res = await collections.userCollection?.findOne(query)

            if (isValidObject(res)) {
                return resolve({ success: true, data: [res] });
            }
            return resolve({ success: false, data: [] });

        } catch (error: any) {
            logger.error(`updateUserLogoutByTokenExpired => ${error.message}`)
            reject(error)
        }
    })
}