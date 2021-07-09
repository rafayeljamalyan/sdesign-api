/** created by r
 *  20-04-21
 *  15:15
 */

// deps
const router = require(`express`).Router();

// local deps
const {	getResponseTemplate } = require(`../../lib/r-back.lib`);
const dataHelpers = require(`./data-helpers`);
const customusecases = require('./custom-usecases');
const {db} = require('../../providers/db');

async function addMeal(dataToAdd){
	const result = getResponseTemplate();
	const foodItems = [...( dataToAdd.foodItems ?? [] )];
	delete dataToAdd.foodItems;

	try {
		const data = await dataHelpers.addNewItem( `meals`, dataToAdd );
		const mealId = data.insertId;
		await dataHelpers.addFoodItemsForMeal( foodItems, mealId );
		result.body.data = {
			message: `Meal successfully added`,
			mealId
		};
		console.log(`added ${ JSON.stringify( dataToAdd ) } to meals `);
	} catch (err) {
		result.status = err.statusCode;
		result.body.errCode = err.errCode;
		result.body.errMessage = err.errMessage;
	}
	return result;
}

router.post( `/meals`, async ( rq, rsp ) =>{
	const dataToAdd = rq.body ? rq.body : rq.fields;
	if ( dataToAdd ) {
		customusecases.changeDataToAdd( `meals` , dataToAdd, rq.tokenData );
		const result = await addMeal( dataToAdd );
		delete result.body.data.mealId;
		rsp.status(result.status).json(result.body);
	}
	else {
		rsp.status( 406 ).json({errCode:3, errMessage: `wrong params`})
	}
})

router.put( `/meals/:id`, async ( rq, rsp ) => {
	const result = getResponseTemplate();
	const resourceKey = `meals`; //rq.params.resourceKey;
	const id = rq.params.id;
	const dataForUpdate = rq.body;

	if ( dataForUpdate ) {
		const foodItems = [...( dataForUpdate.foodItems ?? [] )];
		delete dataForUpdate.foodItems;

		try {
			const data = await dataHelpers.updateData(resourceKey, id, dataForUpdate);
			await dataHelpers.updateFoodItemsForMeal( foodItems, id );
			console.log(`update data of meal for ${ id } `);
			result.body.data = {
				message: `Meal successfully updated`
			};
		} catch (err) {
			console.log( err );
			result.status = err.statusCode;
			result.body.errCode = err.errCode;
			result.body.errMessage = err.errMessage;
		}
		rsp.status(result.status).json(result.body);
	}
	else {
		rsp.status( 406 ).json({errCode:3, errMessage: `wrong params`})
	}

})

const mealDetailedInfo = mealId => new Promise( async (rslv, rjct) => {
	try {
		const mealDataResponse = await dataHelpers.getData( `meals`, { limits: `WHERE id=${mealId}` } );
		if ( mealDataResponse.data instanceof Array && mealDataResponse.data.length > 0 ) {
			const mealData = mealDataResponse.data[0];
			const foodItemsOfMealResponse = await dataHelpers.getData( `meal-food-items`, { limits: `WHERE mealId=${mealId}` } );
			let foodItemsOfMeal = [];
			if ( foodItemsOfMealResponse.data instanceof Array && foodItemsOfMealResponse.data.length > 0 ) {
				foodItemsOfMeal = foodItemsOfMealResponse.data;
				const responses = ( await Promise.all( foodItemsOfMeal.map( el => dataHelpers.getData(`food-items`, { limits: `WHERE \`id\`='${el['food-item-id']}'` } ) ) ) )
					.map( (el,i) => ( {
						foodItem: el.data[0],
						quantity: foodItemsOfMeal[i][`food-item-quantity`]
					}));
				foodItemsOfMeal = responses;
			}
			mealData.foodItems = foodItemsOfMeal;
			rslv( mealData );
		}
	}
	catch( err ) {
		rjct( err );
	}
})

router.get( `/meal-detailed-info/:mealId`, async ( rq, rsp ) => {
	const result = getResponseTemplate();

	const mealId = db.format( `?`,[[rq.params.mealId]] );
	try {
		result.body.data = await mealDetailedInfo( mealId );
	}
	catch( err ) {
		result.status = err.statusCode;
		result.body.errCode = 4;
		result.body.errMessage = `Can't get data`;
	}

	rsp.status(result.status).json(result.body);
})

module.exports = {
	router,
	addMeal,
	mealDetailedInfo
};
