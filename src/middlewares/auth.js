const jwt = require('jsonwebtoken');
const { _UNAUTHORIZED_ } = require('../providers/error-codes.js');
const {
    getTokenDataFromRequest
} = require('./../lib/r-back.lib.js');


exports.secretJwtKey = `secfgS2354-14!`;
exports.authMiddleware = (rq, rsp, next) => {
    try {
        let token = getTokenDataFromRequest(rq);

        if ( token ) {
            const decoded = jwt.verify(token, exports.secretJwtKey);
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
