import jwt from 'jsonwebtoken';
import {
    getTokenDataFromRequest
} from './../lib/r-back.lib'


export const secretJwtKey = `E_859.691-tr`;
export const authMiddleware = (rq, rsp, next) => {
    try {
        let token = getTokenDataFromRequest(rq);

        if (token) {
            const decoded = jwt.verify(token, secretJwtKey);
            rq.authenticated = true;
            rq.tokenData = decoded;
        } 
        else
            throw new Error();

    } catch (err) {
        // TODO
        // check if ther is a need to
        // pass to next middleware sometime
        rq.authenticated = false;

        rsp.status(401).json({
            errCode: 2,
            errMessage: `this resource is accessible only for authenticated users`,
            body: {}
        })
        return;
    }
    next();
}
