import { ObjectId } from 'mongodb';
import { envSettings } from './env.config';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret, SignOptions, TokenExpiredError, VerifyCallback } from 'jsonwebtoken';
import { isDate } from 'lodash';

export const isValidObject = (obj: any): boolean => {
    return obj && Object.keys(obj).length > 0;
};

export const isValidArray = (arr: any): boolean => {
    return arr && Array.isArray(arr) && arr.length > 0;
}

export const isValidURL = (url: any): boolean => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}

export const currentIso = () => new Date().toISOString();

export const uri: any = envSettings.uri;
export const db: any = envSettings.db;
const userTokenSecretKey: Secret | string | undefined = envSettings.userTokenSecretKey;

export const objectId = (id: string | undefined) => new ObjectId(id);

interface Password {
    password?: string | null | any;
    hashPassword?: string | null | any;
    success: boolean;
}

export const encryptPassword = (password: string): Password => {
    try {
        const hash = bcrypt.hashSync(password, 10)

        return {
            hashPassword: hash,
            success: true,
        }
    } catch (error) {
        return {
            hashPassword: null,
            success: false,
        }
    }
}

export const decryptPassword = (password: any, hashPassword: string): Password => {
    try {
        const validPass = bcrypt.compareSync(password, hashPassword)

        return {
            success: validPass,
        }
    } catch (error) {
        return {
            success: false,
        }
    }
}

interface Token {
    token?: string | null | any;
    hashToken?: string | null | any;
    success: boolean;
    decodeToken?: string | null | any;
    isExpiredToken?: boolean;
}

export const encryptToken = (token: string, expires: string | number = '1d'): Token => {
    try {
        const hash = jwt.sign({ token }, userTokenSecretKey as Secret, { expiresIn: expires, issuer: 'expenseManager' } as SignOptions);
        return {
            hashToken: hash,
            success: true,
        }
    } catch (error) {
        return {
            hashToken: null,
            success: false,
        }
    }
}

export const decryptToken = (hashToken: string): Token => {
    try {
        const decode = jwt.verify(hashToken, userTokenSecretKey as Secret) as VerifyCallback<JwtPayload>;
        return {
            decodeToken: decode,
            success: true,
            isExpiredToken: false
        };
    } catch (error) {
        const { expiredAt, message, name, inner } = (error as TokenExpiredError);

        let isExpiredToken: boolean | undefined = false;

        // if token expired
        if (isDate(expiredAt)) {
            isExpiredToken = true;
        }

        return {
            token: null,
            success: false,
            isExpiredToken
        }
    }
}

export const isValidMongoId = (id: string) => {
    const checkMongoId = new RegExp("^[0-9a-fA-F]{24}$");
    return checkMongoId.test(id);
}