const { add, get, deleteFromTable } =  require('../../lib/db.lib.js');
const { db } =  require('../../providers/db.js');
const { _RESOURCE_NOT_FOUND_ } =  require('../../providers/error-codes.js');
const resourses =  require('./resource-info.js');
// const { get, add, update, deleteFromTable }  from './../../lib/db.lib';
// const { db } from '../../providers/db';
// const { _RESOURCE_NOT_FOUND_ } from '../../providers/error-codes';


/** r_function
 *
 * @param parmas OBJECT
 * you can pass 'limits' to specify
 * for example specific row id
 */
exports.getData = ( resourceName, params = {} ) => new Promise( async ( rslv, rjct ) =>{
    const resourseInfo = getResourceInfo( resourceName );
    if ( resourseInfo ) {
        switch ( resourseInfo.type ) {
            case `db`:
                try {
                    const configedQuery = configQuery( params );
                    let data = await get( resourseInfo.table, params, configedQuery.specificColumns, configedQuery.limits, configedQuery.orderColumns );
                    // if you'll try to select users or other resource
                    // where you must get data partially, change query
                    rslv( data );
                }
                catch ( err ) {
                    rjct( err );
                }
                break;
            case `file`:
                break;
        }
    }
    else
        rjct({
            code: _RESOURCE_NOT_FOUND_,
            message: `Resource not found`
        });
});

// // helpers.getDataStructure = key => new Promise( async ( rslv, rjct ) =>{
// //     const resourseInfo = getResourceInfo( key );
// //     if ( resourseInfo ) {
// //         switch ( resourseInfo.type ) {
// //             case `db`:
// //                 try {
// //                     rslv( await dbHelper.getDataStructure( key ) );
// //                 }
// //                 catch ( err ) {
// //                     rjct( err );
// //                 }
// //                 break;
// //             case `file`:
// //                 console.log( `get from file` );
// //                 break;
// //         }
// //     }
// //     else
// //         rjct({
// //             statusCode: 404,
// //             errCode: 44,
// //             errMessage: `resource not found`
// //         });
// // });

exports.addNewItem = ( key, data ) => new Promise( async ( rslv, rjct ) =>{
    console.log(data);
    const resourseInfo = getResourceInfo( key );
    if ( resourseInfo ) {
        switch ( resourseInfo.type ) {
            case `db`:
                try {
                    const res = await add( resourseInfo.table, data );
                    rslv( {
                        insertId: res.insertId,
                        message: `New item successfully added into ${ resourseInfo.table }`
                    });
                }
                catch ( err ) {
                    rjct( err );
                }
                break;
            case `file`:
                console.log( `Add to file` );
                break;
        }
    }
    else
        rjct({
            code: _RESOURCE_NOT_FOUND_,
            message: `Resource not found`
        });
});

exports.deteleItem = ( key, id ) => new Promise( async ( rslv, rjct ) =>{
    const resourseInfo = getResourceInfo( key ); 
    if ( resourseInfo ) {
        switch ( resourseInfo.type ) {
            case `db`:
                try {
                    await deleteFromTable( resourseInfo.table, id );
                    rslv( { 
                        message: `Item deleted successfully from ${ resourseInfo.table }`
                    });
                }
                catch ( err ) {
                    rjct( err );
                }
                break;
            case `file`:
                console.log( `Add to file` );
                break;
        }
    }
    else
        rjct({
            code: _RESOURCE_NOT_FOUND_,
            message: `Resource not found`
        });
});
 
function getResourceInfo ( key ) {
    return resourses.find( resourse => resourse.key === key );
}

function configQuery( config ) {
    const result = {
        specificColumns: [],
        limits: ``,
        orderColumns: []
    }

    if( config ) {
        // for ordering by columns
        if ( config[`order-cols`] ) {
            result.orderColumns = config[`order-cols`].split(`,`);
            delete config[`order-cols`];
        }
        // for custom limiting
        if( config.limits ) {
            result.limits = config.limits;
        }
        // for static limiting
        if ( config.query && JSON.stringify( config.query ) !== "{}" ) {
            if ( !result.limits.toUpperCase().includes( `WHERE` ) ) {
                result.limits = ` WHERE `;
            }
            else {
                result.limits += ` AND `;
            }
            Object.entries( config.query ).forEach( ([key,value], i, arr) => {
                result.limits += db.format(` ??=? `, [[key], [value]]);
                if ( i < arr.length - 1 )
                    result.limits += ` AND `;
            })

        }

        if ( config.columns ) {
            result.specificColumns = config.columns;
        }
    }
    return result;
}

// // module.exports = helpers;
