const { getResponseTemplate } = require( "../../lib/r-back.lib.js");
const { _CANT_INSERT_NEW_VALUE_,  _RESOURCE_NOT_FOUND_ } = require( "../../providers/error-codes.js");
const { addNewItem, deteleItem, getData } = require( "./data-helpers.js");

const logger = require("../../providers/logger.js");

exports.crudGetController = async ( rq, rsp ) => {
	const result = getResponseTemplate();
	try {
		logger.info(`get, ${ rq.params.resource }`);
		const items = await getData( rq.params.resource );
		logger.info(JSON.stringify(items));
		result.body.data.items = items;
	} catch (err) {
		logger.info(JSON.stringify(error));
		result.body.errCode = err.code;
		result.body.errMessage = err.message;
        if ( err.code === _RESOURCE_NOT_FOUND_ ) {
            result.status = 404;
        }
	}
    
	rsp.status(result.status).json(result.body);
};

exports.crudPostController = type => async ( rq, rsp ) => {
	const result = getResponseTemplate();
	const resource = rq.params.resource;
    const payload = type === `form` ? rq.fields : rq.body;
    
    try {
        console.log( payload );
        const dbAnswer = await addNewItem( resource, payload );
        result.body.data = dbAnswer;
    } catch (err) {
        console.log( err );
        result.status = 400;
        result.body.errCode = _CANT_INSERT_NEW_VALUE_;
        result.body.errMessage = `Can't add new item`;
    }
    rsp.status(result.status).json(result.body);  
}

exports.crudDeleteController = async ( rq, rsp ) => {
	const result = getResponseTemplate();
	const resource = rq.params.resource; 
    const payload =  rq.body;
    
    try { 
	logger.info(`delete, ${ rq.params.resource }, ${ payload.id } `);	
        const dbAnswer = await deteleItem( resource, payload.id );
        result.body.data = dbAnswer; 
    } catch (err) {
	logger.info(`delete err, ${ JSON.stringify( err  ) } `);	
        result.status = 400;
        result.body.errCode = _CANT_INSERT_NEW_VALUE_;
        result.body.errMessage = `Can't add new item`;
    }
    rsp.status(result.status).json(result.body);
        
}

exports.notificationPostController = async ( rq, rsp ) => {
    const result = getResponseTemplate();
    const payload = rq.body;
    try {
        const dbAnswer = await addNewItem( `notifications`, payload );
        result.body.data = dbAnswer;
        
    } catch (err) {
        result.status = 400;
        result.body.errCode = _CANT_INSERT_NEW_VALUE_;
        result.body.errMessage = `Can't add new item`;
    }
    rsp.status(result.status).json(result.body);  
}

exports.notificationGetController = async ( rq, rsp ) => {
	const result = getResponseTemplate();
	try {
		const items = await getData( `notifications` );
		result.body.data.items = items;
	} catch (err) {
		result.body.errCode = err.code;
		result.body.errMessage = err.message;
        if ( err.code === _RESOURCE_NOT_FOUND_ ) {
            result.status = 404;
        }
	}
    
	rsp.status(result.status).json(result.body);
};
