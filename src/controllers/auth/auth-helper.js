/** created by r
 *  12-03-21
 *  15:14
 */

// deps
import bcrypt from'bcrypt';
import jwt from'jsonwebtoken';
import { get } from '../../lib/db.lib';
import { db } from '../../providers/db';
import { _CANT_CREATE_JWT_, _CANT_HASH_PASSWORD_, _CANT_VERIFY_JWT_ } from '../../providers/error-codes';
import { secretJwtKey } from '../../middlewares/auth';

const bcryptSaltRounds = 10;
const passwordsSecret = `fds 331Af!`;

export const hashPassword = password => new Promise( ( rslv, rjct ) => {
    bcrypt.hash( password + passwordsSecret, bcryptSaltRounds )
        .then( hash => {
            rslv( hash );
        })
        .catch( () => {
            rjct( {
                code: _CANT_HASH_PASSWORD_,
                message: `Can't create hash of ${ password }`
            })
        })
}) 

export const verify = ( password, hash ) => new Promise( async ( rslv, rjct ) =>{
    bcrypt.compare( password + passwordsSecret, hash )
        .then( areEqual => {
            rslv( areEqual );
        })
        .catch( () => {
            rjct({
                code: _CANT_VERIFY_JWT_,
                message: `Can't compare password with hash`
            })
        })
});

export const getToken = ( data, hours = 1 ) => new Promise( ( rslv, rjct ) =>{
    try {
        data = JSON.parse( JSON.stringify( data ) );
        rslv( jwt.sign( data, secretJwtKey, { expiresIn: 60 * 60 * hours }) );
    }
    catch( err ) {
        rjct( { code: _CANT_CREATE_JWT_ } );
    }
});

// return admin by email, null if can't
export const getAdminUser = async ( email ) => {
    try {
        let users = await get( `admin`, {}, [], db.format( `WHERE \`email\`=?`, [ email ] ) );
        if ( users instanceof Array && users.length > 0 ) {            
            return users[0];
        }
        else throw new Error();
    }
    catch( err ) {
        return null;
    }
} 
