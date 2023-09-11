import { logger } from '@src/utils/logger';
import { resMsg } from './../utils/response.messages';
import { NextFunction, Request, Response } from 'express';
import UrlPattern from 'url-pattern';
import { isObjectLike, isString } from 'lodash';
import { decryptToken, isValidMongoId } from '@src/utils';
import { isRegisteredEmailAndToken } from '@src/services/user/modal/user.modal';

function unRestrictedUrls(url: string): boolean {
    const urls: Array<string> = ['/user/login', '/user'];

    let status = false;

    for (let u of urls) {
        const each_url = new UrlPattern(u);

        if (isObjectLike(each_url.match(url))) {
            status = true;
            break;
        }

        if (status) {
            break;
        }
    }

    if (status) {
        return true;
    }

    return false;
}

async function isValidHeader(req: Request, res: Response, next: NextFunction): Promise<any> {
    const accessToken = req.get('authorization')?.split(' ')[1];
    const authenticatedUserId = req.get('user-id');

    const { url = '' }: { url: string } = req;

    try {
        if (unRestrictedUrls(url)) {
            return next();
        }

        if (!isString(accessToken) || !isString(authenticatedUserId)) {
            return res.status(401).send({ message: resMsg.SEND_VALID_HEADER, success: false, data: [] });
        }

        // check if token is valid or not
        const { decodeToken, success, isExpiredToken } = await decryptToken(accessToken, {
            userId: authenticatedUserId,
        });

        if (!success || isExpiredToken) {
            return res.status(401).send({ message: resMsg.TOKEN_EXPIRED_ERROR, success: false, data: [] });
        }

        // verify user identity
        if (success && !isExpiredToken) {
            const { success: emailTokenSuccess } = await isRegisteredEmailAndToken(decodeToken.token, accessToken, authenticatedUserId);

            if (emailTokenSuccess) {
                return next();
            }
        }

        throw new Error('invalid token');
    } catch (error: any) {
        logger.error(`isValidHeader => ${error.message}`);
        return res.status(401).send({ message: resMsg.INVALID_TOKEN, success: false, data: [] });
    }
}

export { isValidHeader };
