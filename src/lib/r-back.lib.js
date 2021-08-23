const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { _CANT_SEND_EMAIL_ } = require('../providers/error-codes.js');
const logger = require('../providers/logger.js');


/** r_function */
exports.getResponseTemplate = function () {
    return {
        status: 200,
        body: {
            errCode: 0,
            errMessage: ``,
            data: {}
        }
    }
}

/** r_function */
exports.getCookieValue = function ( cookies, key ){
    if ( cookies )
        return cookies.split(`; `).map(cookie=>cookie.split(`=`)).filter(el=>el[0]==key)[0][1];
    else
        return null;
}

exports.getFilePath = url => {
    // eslint-disable-next-line no-undef
    return  path.join( path.resolve( path.dirname('') ), url );
}

exports.getTokenDataFromRequest = rq => {
    let token = rq.header(`token`);
    console.log(token);
    if ( token === undefined ) {
        const cookies = rq.header(`cookie`);
        token = exports.getCookieValue(cookies,`token`);
    }
    return token || null;
}

/** r_function */
exports.uploadFile =  ( file, fpath = `` ) => new Promise( ( rslv, rjct ) => {

    file.name =  file.name.substring( 0, file.name.lastIndexOf(`.`) ) +
                new Date().getTime() + file.name.substring( file.name.lastIndexOf(`.`) );

    fs.readFile( file.path, ( err, data ) => {
        if( err ) {
            rjct( {
                message: `can't read tmp file to upload it`
            })
            return;
        }
        const filePath = path.join( exports.getFilePath( path.join( `public`, `files`, fpath ) ), file.name );
        fs.writeFile(
            filePath,
            data,
            ( err ) => {
                if( err ) {
                    console.log( err );
                    rjct({
                        message: `can't upload file`
                    })
                    return;
                }
                rslv( path.join( fpath, file.name) );
            }
        )
    })

    return file.name;
})

/** r_function */
exports.sendMail = ( subject, content, reciever ) => new Promise(( rslv, rjct ) =>{ 
    const mailConfig = {
        // eslint-disable-next-line no-undef
        email: process.env.EMAIL,
        // eslint-disable-next-line no-undef
        emailPassword: process.env.EMAIL_PASS
    }

    logger.info( JSON.stringify( mailConfig ) );

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: mailConfig.email,
          pass: mailConfig.emailPassword
        }
    });

    const mailOptions = {
        from: mailConfig.email,
        to: reciever,
        subject,
        text: content
    };

    transporter.sendMail( mailOptions, function(error){ //info as second param
        if (error) {
            console.log(error);
            return rjct({
                code: _CANT_SEND_EMAIL_,
                message: `Can't send mail to ${ reciever }`
            });
        }
        rslv(`ok`);
    })
});

const lowerCaseLetters = `abcdefghijklmnopqrstuvwxyz`;
const upperCaseLetters = lowerCaseLetters.toUpperCase();
const numbers = `0123456789`;
const symbols = `_=+-*><()`;
const LOWER_CASE_LETTERS = 1;
const UPPER_CASE_LETTERS = 2;
const NUMBERS = 3;
const SYMBOLS = 4;

/** r_function */
exports.generateNewPassword = length => {
    let res = ``;
    for (let i = 0; i < length; i++) {
        const type = randomNumber( 1, 4 );
        switch ( type ) {
            case LOWER_CASE_LETTERS:
                res += lowerCaseLetters[ randomNumber( 0, lowerCaseLetters.length - 1 ) ];
                break;
            case UPPER_CASE_LETTERS:
                res += upperCaseLetters[ randomNumber( 0, upperCaseLetters.length - 1 ) ];
                break;
            case NUMBERS:
                res += numbers[ randomNumber( 0, numbers.length - 1 ) ];
                break;
            case SYMBOLS:
                res += symbols[ randomNumber( 0, symbols.length - 1 ) ];
                break;
        }
    }
    return res;
}

/** r_function */
function randomNumber ( from, to ) {
    return Math.round( Math.random() * Math.abs( to - from ) ) + from;
}
 
