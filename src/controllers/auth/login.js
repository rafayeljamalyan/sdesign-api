// internal deps
import { _UNAUTHORIZED_, _USER_NOT_FOUND_ } from '../../providers/error-codes';
import { getAdminUser, getToken, verify } from './auth-helper';

export const loginUser = ({ email, password }) => new Promise( async ( rslv, rjct ) => {
    let user = {};
    let isAuthenticated = false;

    try {
        user = await getAdminUser( email );
        if ( !user ) throw { code: _USER_NOT_FOUND_ };

        isAuthenticated = await verify( password, user.password );
        if ( isAuthenticated ) {    
            const token = await getToken( { email } );
            rslv( token );
        }
        else
            rjct( { code: _UNAUTHORIZED_ } );
    }
    catch ( err ) {
        return rjct( err );
    }
    
})
 