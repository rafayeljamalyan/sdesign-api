const jwt = require('jsonwebtoken');

const { exec } = require('../../lib/db.lib.js');
const { getResponseTemplate, getTokenDataFromRequest, sendMail } = require("../../lib/r-back.lib.js");
const { secretJwtKey } = require("../../middlewares/auth.js");
const { _CANT_SEND_EMAIL_, _CANT_VERIFY_RESET_TOKEN_, _EMAIL_OR_PASSWORD_IS_INCORRECT_, _NOT_VERIFIED_TO_CHANGE_PASSWORD_, _UNAUTHORIZED_, _USER_NOT_FOUND_, _WRONG_RESET_PASSWORD_TOKEN_ } = require("../../providers/error-codes.js");
const { genereteResetCode, getAdminUser, getToken, hashPassword } = require("./auth-helper.js");
const { loginUser } = require("./login.js");
const logger = require(`./../../providers/logger`);

const PASSWORD_RESET_VERIFIED = 2;


const loginController = async ( rq, rsp ) => {  
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

const startResetPasswordController = async ( rq, rsp ) => {
    const result = getResponseTemplate();
    
    logger.info(`BODY reset ` + JSON.stringify( rq.body ) );
    try {
        if ( rq.body.email !== `info.sdesignstudio@gmail.com` ) throw { code: _CANT_SEND_EMAIL_ };
        const resetCode = genereteResetCode();
        await sendMail( `RESET PASSWORD`, `reset code - ${ resetCode }`, rq.body.email );
        const token = await getToken( { resetCode, email: rq.body.email } );
        result.body.data.token = token;
    }
    catch ( err ) {
      logger.info(`ERRR reset ` + JSON.stringify( err ) );
        result.body.errCode = err.code;
        if ( err.code === _CANT_SEND_EMAIL_ ) {
            result.status = 500;
            result.body.errMessage = `Can't send an email!`;
        }
    }
    
    rsp.status( result.status ).json( result.body ); 
}

const verifyResetPasswordController = async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {        
        const token = getTokenDataFromRequest(rq);
        const decoded = jwt.verify( token, secretJwtKey );
        if ( `resetCode` in decoded ) {
            if ( decoded.resetCode != rq.body.resetCode ) throw new Error();
            
            await exec(`UPDATE \`admin\` SET \`status\`=${PASSWORD_RESET_VERIFIED} `);
        }
        else throw new Error();
    }
    catch ( err ) { 
        result.status = 406;
        result.body.errCode = _CANT_VERIFY_RESET_TOKEN_;
        result.body.errMessage = `Can't verify reset token`; 
    }
    
    rsp.status( result.status ).json( result.body ); 
}

const resetPasswordController = async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const token = getTokenDataFromRequest(rq);
        const decoded = jwt.verify( token, secretJwtKey );
        if ( `email` in decoded ) {
            const admin = await getAdminUser( decoded.email );
            if ( admin.status === PASSWORD_RESET_VERIFIED ) {
                const hashedNewPassword = await hashPassword(rq.body[`new-password`]);
                await exec(`UPDATE \`admin\` SET \`status\`=0, \`password\`=? `, [ hashedNewPassword ] );
            }
            else { // can't reset password
                throw { code: _NOT_VERIFIED_TO_CHANGE_PASSWORD_ };
            }
        }
        else { // wrong token 
            throw { code: _WRONG_RESET_PASSWORD_TOKEN_ };
        }
        
    }
    catch ( err ) {
        console.log( err );
        if ( `code` in err ) {
            result.body.errCode = err.code;
            if ( err.code === _WRONG_RESET_PASSWORD_TOKEN_ ) {
                result.status = 406;
                result.body.errMessage = `Wrong reset password token.`;
            }
            else if ( err.code === _NOT_VERIFIED_TO_CHANGE_PASSWORD_ ) {
                result.status = 403;
                result.body.errMessage = `You must verify password change.`;
            }
        }
        else {
            result.status = 406;
            result.body.errCode = _CANT_VERIFY_RESET_TOKEN_;
            result.body.errMessage = `Can't verify reset token`; 
        }
    }
    
    rsp.status( result.status ).json( result.body ); 
}

module.exports = {
  loginController,
  startResetPasswordController,
  verifyResetPasswordController,
  resetPasswordController
};

