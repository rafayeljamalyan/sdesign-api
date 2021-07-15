/** created by r
 *  11-03-21
 *  12:01
 */

import { uploadFile } from "../lib/r-back.lib";


// dependencies
const uploaderMiddleware = async ( rq, rsp, next ) => {
    if( rq.files ) {
        const files = Object.entries( rq.files );
        for ( let i = 0; i < files.length; i++ ) {
            const [ key, file ] = files[i];
            try {
                const filePath = await uploadFile( file );
                if ( rq.fields ) {
                    rq.fields[ key ] = filePath;
                }
            }
            catch( err ) {
                console.log( err );
            }
        }
    }
    next();
};


export default uploaderMiddleware;