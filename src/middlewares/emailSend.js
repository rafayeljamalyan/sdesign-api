import { add } from "../lib/db.lib";
import { getResponseTemplate } from "../lib/r-back.lib"
import { _CANT_SEND_EMAIL_ } from "../providers/error-codes";

export const emailSend = async (rq ,rsp) => {
    const result = getResponseTemplate();
    try{
        // await sendMail( `From Sdesign`, `${ rq.body.content }`, rq.body["sender-email"] );
        await add( `notifications`, rq.body );
    }
    catch(err) {
        result.body.errCode = err.code;
        if ( err.code === _CANT_SEND_EMAIL_ ) {
            result.status = 500;
            result.body.errMessage = `Can't send an email!`;
        }
    }
    rsp.status(result.status).json(result.body);  
}
