import { getResponseTemplate, sendMail } from "../../lib/r-back.lib";
import { _CANT_SEND_EMAIL_, _EMAIL_OR_PASSWORD_IS_INCORRECT_, _UNAUTHORIZED_, _USER_NOT_FOUND_ } from "../../providers/error-codes";
import { genereteResetCode, getToken } from "./auth-helper";
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

export const resetPasswordController = async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const resetCode = genereteResetCode();
        await sendMail( `RESET PASSWORD`, `reset code - ${ resetCode }`, rq.body.email );
        const token = await getToken( { resetCode } );
        result.body.data.token = token;
    }
    catch ( err ) {
        result.body.errCode = err.code;
        if ( err.code === _CANT_SEND_EMAIL_ ) {
            result.status = 500;
            result.body.errMessage = `Can't send an email!`;
        }
    }
    
    rsp.status( result.status ).json( result.body ); 
}
