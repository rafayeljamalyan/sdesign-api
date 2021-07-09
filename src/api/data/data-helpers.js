import resourses from './resource-info';
import { get, add, update, deleteFromTable }  from './../../lib/db.lib';
import { db } from '../../providers/db';
import { _RESOURCE_NOT_FOUND_ } from '../../providers/error-codes';

// const helpers = {};

/** r_function
 *
 * @param parmas OBJECT
 * you can pass 'limits' to specify
 * for example specific row id
 */
export const getData = ( resourceName, params ) => new Promise( async ( rslv, rjct ) =>{
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
            errCode: _RESOURCE_NOT_FOUND_,
            errMessage: `Resource not found`
        });
});

// helpers.getDataStructure = key => new Promise( async ( rslv, rjct ) =>{
//     const resourseInfo = getResourceInfo( key );
//     if ( resourseInfo ) {
//         switch ( resourseInfo.type ) {
//             case `db`:
//                 try {
//                     rslv( await dbHelper.getDataStructure( key ) );
//                 }
//                 catch ( err ) {
//                     rjct( err );
//                 }
//                 break;
//             case `file`:
//                 console.log( `get from file` );
//                 break;
//         }
//     }
//     else
//         rjct({
//             statusCode: 404,
//             errCode: 44,
//             errMessage: `resource not found`
//         });
// });

export const addNewItem = ( key, data ) => new Promise( async ( rslv, rjct ) =>{
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
            errCode: _RESOURCE_NOT_FOUND_,
            errMessage: `Resource not found`
        });
});

// helpers.addFoodItemsForMeal = ( foodItems, mealId ) => new Promise( async ( rslv, rjct ) => {

// 	try {
// 		const res = await Promise.all(
// 			foodItems.map( item => dbHelper.add( `meal-food-items`, {
// 					mealId,
// 					'food-item-id': item.foodItemId,
// 					'food-item-quantity': item.quantity
// 			}))
// 		)
// 		rslv({
// 				message: `new food items successfully added`
// 		});
// 	}
// 	catch ( err ) {
// 		rjct({
// 			statusCode: 500,
// 			errCode: 5,
// 			errMessage: `cant add food items of meal`
// 		});
// 	}
// })

// helpers.updateFoodItemsForMeal = ( foodItems, mealId ) => new Promise ( async ( rslv, rjct ) =>{

// 	let deleteQuery = `DELETE FROM \`meal-food-items\` WHERE mealId = ?;`
// 	deleteQuery = db.format( deleteQuery, [ [ mealId ] ] )
// 	try {
// 		const rslt = await dbHelper.exec( deleteQuery );
// 		await helpers.addFoodItemsForMeal( foodItems, mealId );
// 		rslv( { message: `ok` } );
// 	}
// 	catch( err ) {
// 		rjct( err );
// 	}
// })

export const updateData = ( key, id, data ) => new Promise( async ( rslv, rjct ) => {
    const resourseInfo = getResourceInfo( key );
    if ( resourseInfo ) {
        switch ( resourseInfo.type ) {
            case `db`:
                try {
                    await update( resourseInfo.table, id, data );
                    rslv( {
                        message: `The item with id ${id} in table ${ resourseInfo.table } successfully updated!`
                    });
                }
                catch ( err ) {
                    rjct( err );
                }
                break;
            case `file`:
                console.log( `Update in file` );
                break;
        }
    }
    else
        rjct({
            errCode: _RESOURCE_NOT_FOUND_,
            errMessage: `Resource not found`
        });
});

export const deleteData = ( key, id, field ) => new Promise( async ( rslv, rjct ) =>{
    const resourseInfo = getResourceInfo( key );
    if ( resourseInfo ) {
        switch ( resourseInfo.type ) {
            case `db`:
                try {
                    await deleteFromTable( resourseInfo.table, id, field );
                    rslv( {
                        message: `The item with ${field ? `field` :  `id`} ${ field ? field: id} deleted from  table ${ resourseInfo.table }`
                    });
                }
                catch ( err ) {
                    rjct( err );
                }
                break;
            case `file`:
                console.log( `Delete from file` );
                break;
        }
    }
    else
        rjct({
            errCode: _RESOURCE_NOT_FOUND_,
            errMessage: `Resource not found`
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
        if ( config[`order-cols`] ) {
            result.orderColumns = config[`order-cols`].split(`,`);
            delete config[`order-cols`];
        }
        if( config.limits ) {
            result.limits = config.limits;
        }
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

// module.exports = helpers;
