import jwt from 'jsonwebtoken';
import { _UNAUTHORIZED_ } from '../providers/error-codes';
import {
    getTokenDataFromRequest
} from './../lib/r-back.lib'


export const secretJwtKey = `secfgS2354-14!`;
export const authMiddleware = (rq, rsp, next) => {
    try {
        let token = getTokenDataFromRequest(rq);

        if ( token ) {
            const decoded = jwt.verify(token, secretJwtKey);
            rq.authenticated = true;
            rq.tokenData = decoded;
        } 
        else
            throw new Error();

    } catch (err) {
        return rsp.status(401).json({
            errCode: _UNAUTHORIZED_,
            errMessage: `This resource is accessible only for authenticated users`,
            body: {}
        });        
    }
    next();
}
