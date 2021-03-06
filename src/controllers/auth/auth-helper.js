/** created by r
 *  12-03-21
 *  15:14
 */

// deps
const bcrypt  = require( 'bcrypt');
const jwt  = require( 'jsonwebtoken');

const { get }  = require( '../../lib/db.lib.js');
const { db }  = require( '../../providers/db.js');
const { _CANT_CREATE_JWT_, _CANT_HASH_PASSWORD_, _CANT_VERIFY_JWT_ }  = require( '../../providers/error-codes.js');
const { secretJwtKey }  = require( '../../middlewares/auth.js');

const bcryptSaltRounds = 10;
const passwordsSecret = `fds 331Af!`;

exports.hashPassword = password => new Promise( ( rslv, rjct ) => {
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

exports.verify = ( password, hash ) => new Promise( async ( rslv, rjct ) =>{
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

exports.getToken = ( data, hours = 1 ) => new Promise( ( rslv, rjct ) =>{
    try {
        data = JSON.parse( JSON.stringify( data ) );
        rslv( jwt.sign( data, secretJwtKey, { expiresIn: 60 * 60 * hours }) );
    }
    catch( err ) {
        rjct( { code: _CANT_CREATE_JWT_ } );
    }
});

// return admin by email, null if can't
exports.getAdminUser = async ( email ) => {
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

exports.genereteResetCode = () => {
    const nums = `0123456789`;
    let res = ``;
    for (let i = 0; i < 4; i++) {
        res += nums[ randomNumber( 0, 9 ) ];
    }
    return res;
}

/** r_function */
function randomNumber ( from, to ) {
    return Math.round( Math.random() * Math.abs( to - from ) ) + from;
}

