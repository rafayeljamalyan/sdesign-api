/** created by r 
 *  02-04-21
 *  16:38
 */

// internal deps
const { isSuperAdmin } = require( `../../lib/r-back.lib` );

const SUPERADMIN = 1;

const customusecases = {};

customusecases.getForCustomers = tokenData => {
    const result = {};
    if ( !isSuperAdmin(tokenData ) ) {
        if ( tokenData[`trainer-id`]  ) {
            result.limits = `WHERE \`trainer-id\` = ${tokenData[`trainer-id`] }`;
        }
        else {
            result.limits = `WHERE 1 = 0`;
        }
    }
    
    return result;
}

customusecases.getForMealsOrFoodItems =  tokenData  => {
    const result = {};

    if ( tokenData[`trainer-id`] )
        result.limits = `WHERE \`creator-id\` IN ( ${ tokenData[`trainer-id`]}, ${ SUPERADMIN } )`;

    return result;
}

customusecases.getForTrainers = tokenData => {
    const result = {};
    if ( isSuperAdmin(tokenData ) ) {        
        result.limits = `WHERE \`id\`!=${SUPERADMIN} `;
    }
    
    return result;
}

customusecases.changeDataToAdd = ( resource, data, tokenData ) => {
    if ( resource === `food-items`|| resource === `meals` ) {
        data[`creator-id`] = tokenData[`trainer-id`];
    }
}

module.exports = customusecases;
