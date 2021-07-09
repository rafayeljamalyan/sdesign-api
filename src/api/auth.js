// deps
import { Router } from 'express';
import { loginController, resetPasswordController } from '../controllers/auth';
import validate from '../middlewares/validate';
const router = Router();
// import formidableMiddleware from 'express-formidable';
// import jwt from 'jsonwebtoken';

router.post( `/login`, validate(`login`), loginController );

router.post( `/reset-password`, validate( `reset-password` ), resetPasswordController );

export default router;

// // internal deps
// const register = require( `./register` );
// const login = require('./login');
// const authHelper = require( `./auth-helper` );
// const rfileUploader = require(`./../../middlewares/rfileUploader`);
// const validator = require("../../helpers/validator");
// const { getResponseTemplate, sendMail, generateNewPassword, getTokenDataFromRequest } = require( `../../lib/r-back.lib` );
// const { secretJwtKey } = require('../../middlewares/auth');

// const tokenData = ( rq, rsp, next ) => {
//     let _tokenData = null
//     const token = getTokenDataFromRequest( rq );
//     try {
//         _tokenData =  jwt.verify(token, secretJwtKey );        
//     }
//     catch( err ) {}
    
//     if ( _tokenData )
//         rq.tokenData = _tokenData;
//     next();
// };

// const registerHandler = type =>  async ( rq, rsp ) => {
//     if ( !rq.tokenData ) {
//         rsp.status( 401 ).json({errCode: 41, errMessage: `not authenticated`, data:{}})
//         return; 
//     }

//     let data = type === `form` ? rq.fields : rq.body;
//     if ( type === `form` ) {
//         const clearedData = { email: data.email, password: data.password };       
//         clearedData.userData = {};
//         Object.entries( data ).forEach( ([ key, value ] ) => {
//             if ( !([`email`,`password`,`userData`].includes(key)) ) {
//                 let temp = value;
//                 delete data[key];
//                 clearedData.userData[key] = temp;
//             }
//         })
//         data = clearedData;
//     }

//     checkDataToAdd( `registerCustomer`, data, rq.tokenData );
    
//     const result = getResponseTemplate();
//     const { valid:areParamsValid, messages:validationMessages } = validator.validateObject( data, {
//         email: { required: true, email: true },
//         password: { required: true, minLength: 8, maxLength: 20 },
//         userData: { required:  ( type !== `form` )  }
//     });
    
//     if( areParamsValid ) {
//         try {
//             const registrationResult = await register.registerUser( data );
//             result.body.data = registrationResult;
//         }
//         catch ( err ) {
//             result.status = err.statusCode;
//             result.body.errCode = err.errCode;
//             result.body.errMessage = err.errMessage;
//         }
//     }
//     else {
//         result.status = 406;
//         result.body.errCode = 46;
//         result.body.errMessage = `wrong params`;
//         result.body.data = validationMessages;
//     }
//     rsp.status( result.status ).json( result.body ); 
// }

// router.post(`/registerCustomer`, tokenData, registerHandler(`json`) );

// router.post(`/form/registerCustomer`, tokenData, formidableMiddleware(), rfileUploader, registerHandler(`form`) );

// const registerTrainerHandler = type => async ( rq, rsp ) => {
//     let data = type === `form` ? rq.fields : rq.body;
//     if ( type === `form` ) {
//         const clearedData = { email: data.email, password: data.password };       
//         clearedData.trainerData = {};
//         Object.entries( data ).forEach( ([ key, value ] ) => {
//             if ( !([`email`,`password`,`trainerData`].includes(key)) ) {
//                 let temp = value;
//                 delete data[key];
//                 clearedData.trainerData[key] = temp;
//             }
//         })
//         data = clearedData;
//     }

//     const result = getResponseTemplate();
//     const { valid:areParamsValid, messages:validationMessages } = validator.validateObject( data, {
//         email: { required: true, email: true },
//         password: { required: true, minLength: 8, maxLength: 20 },
//         trainerData: { required: ( type !== `form` )  }
//     });
    
//     if( areParamsValid ) {
//         try {
//             const registrationResult = await register.registerTrainer( data );
//             result.body.data = registrationResult;
//         }
//         catch ( err ) {
//             result.status = err.statusCode;
//             result.body.errCode = err.errCode;
//             result.body.errMessage = err.errMessage;
//         }
//     }
//     else {
//         result.status = 406;
//         result.body.errCode = 46;
//         result.body.errMessage = `wrong params`;
//         result.body.data = validationMessages;
//     }
//     rsp.status( result.status ).json( result.body ); 
// }

// router.post(`/registerTrainer`, registerTrainerHandler(`json`) );

// router.post(`/form/registerTrainer`, formidableMiddleware(), registerTrainerHandler(`form`));

// // @TODO
// // understand is there a need to
// // wait for mail sending
// router.post(`/forgot-password`, async ( rq, rsp ) => {
//     const result = getResponseTemplate();
//     const { valid:areParamsValid, messages:validationMessages } = validator.validateObject( rq.body, {
//         emailOrUsername: { required: true }
//     });

//     if ( areParamsValid ) {
//         try {
//             const user = await authHelper.getUser( rq.body, `users` );
//             if ( user && user.email && user.email.length > 0 ) {
//                 const newPassword = generateNewPassword( 8 );
//                 await Promise.all([
//                     sendMail( `PASSWORD RECOVERY`, `your new password is \n ${ newPassword }`, user.email ),
//                     authHelper.changePasswordOfUser( user, newPassword )
//                 ]);
//             }
//             result.body.data.message = `ok`;
//         }
//         catch ( err ) {
//             console.log( err );
//             result.status = err.statusCode;
//             result.body.errCode = err.errCode;
//             result.body.errMessage = err.errMessage;
//         }
//     }
//     else {
//         result.status = 406;
//         result.body.errCode = 46;
//         result.body.errMessage = `wrong params`;
//         result.body.data = validationMessages;
//     }
//     rsp.status( result.status ).json( result.body ); 
// })

// /** r_function */
// function checkDataToAdd ( resource, data, tokenData ) {
//     console.log( tokenData );
//     const resourcesToChange = [ `registerCustomer` ];
//     if( resourcesToChange.includes( resource ) ) {
//         data.userData[`trainer-id`] = tokenData[`trainer-id`];        
//     }
//     return data;
// }

// module.exports = router;
