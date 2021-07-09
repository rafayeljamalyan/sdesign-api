import { Router } from 'express';
import { _UNKNOWN_ERROR_ } from '../../providers/error-codes.js';
import { getResponseTemplate } from './../../lib/r-back.lib.js';
import { getData } from './data-helpers.js';
const router = Router();

router.get(`/home-slider`, async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const homeSliderData = await getData( `home-slider` );
        result.body.data.items = homeSliderData;
    }
    catch( err ) {
        result.status =  500;
        result.body = {
            errMessage: `Can't get data from db`,
            errCode: ( 'errCode' in err ) ? err.errCode : _UNKNOWN_ERROR_,
            data: {}
        };
    }

    rsp.status(result.status).json(result.body);
})

// TODO fill db
// TODO write doc
router.get(`/top-6-courses`, async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const top6Courses = await getData( `courses`, { limit: ` ORDER BY \`rate\` DESC  LIMIT 6 ;` } );
        result.body.data.items = top6Courses;
    }
    catch( err ) {
        result.status =  500;
        result.body = {
            errMessage: `Can't get data from db`,
            errCode: ( 'errCode' in err ) ? err.errCode : _UNKNOWN_ERROR_,
            data: {}
        };
    }

    rsp.status(result.status).json(result.body);
})

// TODO fill db
// TODO write doc
router.get(`/courses`, async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const courses = await getData( `courses` );
        result.body.data.items = courses;
    }
    catch( err ) {
        result.status =  500;
        result.body = {
            errMessage: `Can't get data from db`,
            errCode: ( 'errCode' in err ) ? err.errCode : _UNKNOWN_ERROR_,
            data: {}
        };
    }

    rsp.status(result.status).json(result.body);
})


// TODO fill db
// TODO write doc
router.get(`/facts`, async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const facts = await getData( `facts` );
        result.body.data.items = facts;
    }
    catch( err ) {
        result.status =  500;
        result.body = {
            errMessage: `Can't get data from db`,
            errCode: ( 'errCode' in err ) ? err.errCode : _UNKNOWN_ERROR_,
            data: {}
        };
    }

    rsp.status(result.status).json(result.body);
})

// TODO fill db
// TODO write doc
router.get(`/staff`, async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const staff = await getData( `staff` );
        result.body.data.items = staff;
    }
    catch( err ) {
        result.status =  500;
        result.body = {
            errMessage: `Can't get data from db`,
            errCode: ( 'errCode' in err ) ? err.errCode : _UNKNOWN_ERROR_,
            data: {}
        };
    }

    rsp.status(result.status).json(result.body);
})

// TODO fill db
// TODO write doc
router.get(`/success-stories`, async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const successStories = await getData( `success-stories` );
        result.body.data.items = successStories;
    }
    catch( err ) {
        result.status =  500;
        result.body = {
            errMessage: `Can't get data from db`,
            errCode: ( 'errCode' in err ) ? err.errCode : _UNKNOWN_ERROR_,
            data: {}
        };
    }

    rsp.status(result.status).json(result.body);
})

router.get(`/contact-data`,  async ( rq, rsp ) => {
    const result = getResponseTemplate();

    try {
        const [ [ contact ], phones ] = await Promise.all([
            getData( `contact` ),
            getData( `contact-phones`, { limits: ` WHERE \`contact-id\`=1` } )
        ]);
        contact.phones = phones.map( phoneObj => phoneObj.phone );
        result.body.data = contact;
    }
    catch( err ) {
        result.status =  500;
        result.body = {
            errMessage: `Can't get data from db`,
            errCode: ( 'errCode' in err ) ? err.errCode : _UNKNOWN_ERROR_,
            data: {}
        };
    }

    rsp.status(result.status).json(result.body);
})

// import formidableMiddleware from 'express-formidable';
 
// import { getResponseTemplate } from '../../lib/r-back.lib';
// const dataHelpers = require(`./data-helpers`);
// const rfileUploader = require(`./../../middlewares/rfileUploader`);
// const superAdminRestrictions = require('../../middlewares/superAdminRestrictions');
// const customusecases = require('./custom-usecases');
// const {
// 	TRAINER,
// 	SUPERADMIN
// } = require(`../../providers/constants`).roles;

// const localMiddlewares = {};

// localMiddlewares.accessibleOnlyForTrainers = (rq, rsp, next) => {
// 	const accessibleOnlyForTrainers = [`users`];
// 	if (accessibleOnlyForTrainers.includes(rq.params.resourceKey)) {
// 		if (rq.tokenData[`role-id`] === TRAINER || rq.tokenData[`role-id`] === SUPERADMIN) {
// 			next();
// 		} else {
// 			rsp.status(403).json({
// 				errCode: 43,
// 				errMessage: `this resource is accessible only for trainers`,
// 				body: {}
// 			})
// 		}
// 	} else {
// 		next();
// 	}
// }

// router.use(`*`, (rq, rsp, next) => {
// 	if (!rq.authenticated) {
// 		rsp.status(401).json({
// 			...getResponseTemplate().body,
// 			data: {
// 				message: `only authenticated users can acces this route`
// 			}
// 		});
// 		return;
// 	}
// 	next();
// });

// router.use(`/others`, othersRouter);

// // create
// const createHandler = type => async (rq, rsp) => {
// 	const result = getResponseTemplate();
// 	const resourceKey = rq.params.resourceKey;
// 	const dataToAdd = checkDataToAdd(resourceKey, (type === `form`) ? rq.fields : rq.body, rq.tokenData);
// 	const redirectionData = checkRedirection( resourceKey );

// 	if ( redirectionData ) {
// 		rsp.redirect( 307, rq.baseUrl + redirectionData.path );
// 	}
// 	else {
// 		try {
// 			const data = await dataHelpers.addNewItem( resourceKey, dataToAdd );
// 			result.body.data = data;
// 			console.log(`added ${ JSON.stringify( dataToAdd ) } to ${ resourceKey } `);
// 		} catch (err) {
// 			result.status = err.statusCode;
// 			result.body.errCode = err.errCode;
// 			result.body.errMessage = err.errMessage;
// 		}
// 		rsp.status(result.status).json(result.body);
// 	}
// };

// router.post(`/:resourceKey`, localMiddlewares.accessibleOnlyForTrainers, superAdminRestrictions, createHandler(`json`));

// router.post(`/form/:resourceKey`, localMiddlewares.accessibleOnlyForTrainers, superAdminRestrictions, formidableMiddleware(), rfileUploader, createHandler(`form`));

// // read
// router.get(`/:resourceKey`, localMiddlewares.accessibleOnlyForTrainers, superAdminRestrictions, async (rq, rsp) => {
// 	const result = getResponseTemplate();
// 	try {
// 		const params = await getDataGettingParams(rq.params.resourceKey, rq);
// 		const data = await dataHelpers.getData(rq.params.resourceKey, params);
// 		console.log(`get data for ${ rq.params.resourceKey } `);
// 		result.body.data = data;
// 	} catch (err) {
// 		result.status = err.statusCode;
// 		result.body.errCode = err.errCode;
// 		result.body.errMessage = err.errMessage;
// 	}
// 	rsp.status(result.status).json(result.body);
// });

// router.get(`/structure/:resourceKey`, localMiddlewares.accessibleOnlyForTrainers, superAdminRestrictions, async (rq, rsp) => {
// 	const result = getResponseTemplate();
// 	try {
// 		const data = await dataHelpers.getDataStructure(rq.params.resourceKey);
// 		console.log(`get structure for ${ rq.params.resourceKey }`);
// 		result.body.data = data;
// 	} catch (err) {
// 		result.status = err.statusCode;
// 		result.body.errCode = err.errCode;
// 		result.body.errMessage = err.errMessage;
// 	}
// 	rsp.status(result.status).json(result.body);
// });

// // update
// const updateHandler = type => async (rq, rsp) => {
// 	const result = getResponseTemplate();
// 	const dataForUpdate = (type === `form`) ? rq.fields : rq.body;
// 	const {
// 		resourceKey,
// 		id
// 	} = rq.params;

// 	const redirectionData = checkRedirection( resourceKey );

// 	if ( redirectionData ) {
// 		rsp.redirect( 307, rq.baseUrl + redirectionData.path + `/${id}` );
// 	}
// 	else {
// 		try {
// 			const data = await dataHelpers.updateData(resourceKey, id, dataForUpdate);
// 			console.log(`update data of ${ resourceKey } for ${ id } `);
// 			result.body.data = data;
// 		} catch (err) {
// 			result.status = err.statusCode;
// 			result.body.errCode = err.errCode;
// 			result.body.errMessage = err.errMessage;
// 		}
// 		rsp.status(result.status).json(result.body);
// 	}
// };

// router.put(`/:resourceKey/:id`, localMiddlewares.accessibleOnlyForTrainers, superAdminRestrictions, updateHandler(`json`));

// router.put(`/form/:resourceKey/:id`, localMiddlewares.accessibleOnlyForTrainers, superAdminRestrictions, formidableMiddleware(), rfileUploader, updateHandler(`form`));

// // delete
// router.delete(`/:resourceKey/:field`, localMiddlewares.accessibleOnlyForTrainers, superAdminRestrictions, async (rq, rsp) => {
// 	const result = getResponseTemplate();
// 	try {
// 		const data = await dataHelpers.deleteData(rq.params.resourceKey, rq.params.field, rq.query?.field);
// 		console.log(`deleta item with ${ rq.query?.field ? rq.query.field : `id` } ${ rq.params.field } in ${ rq.params.resourceKey } `);
// 		result.body.data = data;
// 	} catch (err) {
// 		result.status = err.statusCode;
// 		result.body.errCode = err.errCode;
// 		result.body.errMessage = err.errMessage;
// 	}
// 	rsp.status(result.status).json(result.body);
// });
// /** r_function */
// async function getDataGettingParams(key, rq) {
// 	let result = {
// 		query: rq.query
// 	}

// 	const restrictedResources = [
// 		`customers`, `meals`, `food-items`, `trainers`
// 	];

// 	if (restrictedResources.includes(key)) {

// 		if (key === `customers`) {
// 			result = {
// 				...result,
// 				...customusecases.getForCustomers(rq.tokenData)
// 			}
// 		} else if (key === `meals` || key === `food-items`) {
// 			result = {
// 				...result,
// 				...customusecases.getForMealsOrFoodItems(rq.tokenData)
// 			}
// 		} else if (key === `trainers`) {
// 			result = {
// 				...result,
// 				...customusecases.getForTrainers(rq.tokenData)
// 			}
// 		}
// 	}

// 	return result;
// }

// /** r_function */
// function checkDataToAdd(resource, data, tokenData) {
// 	const resourcesToChange = [`food-items`];
// 	if (resourcesToChange.includes(resource)) {
// 		customusecases.changeDataToAdd(resource, data, tokenData);
// 	}
// 	return data;
// }

// /** r_function */
// function checkRedirection( resource ) {
// 	return  [
// 		{
// 			resourceName: `meals`,
// 			path: `/others/meals`
// 		}
// 	].find( el => resource === el.resourceName );
// }


export default router;
