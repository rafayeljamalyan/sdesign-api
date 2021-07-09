
// internal deps
// const constants = require("../../providers/constants");
// const dataHelpers = require( `../../api/data/data-helpers` );
// const authHelper = require( `./auth-helper` );

// const register = {};

// register.registerUser = params => new Promise( async ( rslv, rjct ) => {
//     try {
//         try {
//             params.password = await authHelper.hashPassword( params.password );
//         }
//         catch( err ) {
//             throw { statusCode: 501, errCode: 51, message: err.message };
//         }

//         await dataHelpers.addNewItem( `users`, {
//             email: params.email,
//             password: params.password,
//             'role-id': constants.roles.CUSTOMER
//         });
//         await dataHelpers.addNewItem( `customers`, {
//             ...params.userData,
//             email: params.email
//         })

//         rslv({message: `ok`});
//     }
//     catch ( err ) {
//         rjct( err );
//     }
// });

// register.registerTrainer = params => new Promise( async ( rslv, rjct ) => {
//     try {
//         try {
//             params.password = await authHelper.hashPassword( params.password );
//         }
//         catch( err ) {
//             throw { statusCode: 501, errCode: 51, message: err.message };
//         }

//         await dataHelpers.addNewItem( `users`, {
//             email: params.email,
//             password: params.password,
//             'role-id': constants.roles.TRAINER
//         });
//         await dataHelpers.addNewItem( `trainers`, {
//             ...params.trainerData,
//             email: params.email
//         })

//         rslv({message: `ok`});
//     }
//     catch ( err ) {
//         rjct( err );
//     }
// });

// module.exports = register;
