import { getResponseTemplate } from "../../lib/r-back.lib";
import { _EMAIL_OR_PASSWORD_IS_INCORRECT_, _UNAUTHORIZED_, _USER_NOT_FOUND_ } from "../../providers/error-codes";
import { loginUser } from "./login";

export const loginController = async ( rq, rsp ) => {  
    const result = getResponseTemplate();

    try {
        const token = await loginUser( rq.body );
        result.body.data.token = token;
    }
    catch ( err ) {
        result.body.errCode = err.code;
        if ( err.code === _USER_NOT_FOUND_ || err.code === _UNAUTHORIZED_ ) {
            result.status = 401;
            result.body.errCode = _EMAIL_OR_PASSWORD_IS_INCORRECT_;
            result.body.errMessage = `Email or password is incorrect!`;
        }
    }
    
    rsp.status( result.status ).json( result.body ); 
}
