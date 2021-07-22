import { getResponseTemplate } from "../../lib/r-back.lib.js";
import { _CANT_INSERT_NEW_VALUE_,  _RESOURCE_NOT_FOUND_ } from "../../providers/error-codes.js";
import { addNewItem, deteleItem, getData } from "./data-helpers.js";


export const crudGetController = async ( rq, rsp ) => {
	const result = getResponseTemplate();
	try {
		const items = await getData( rq.params.resource );
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

export const crudPostController = type => async ( rq, rsp ) => {
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

export const crudDeleteController = async ( rq, rsp ) => {
	const result = getResponseTemplate();
	const resource = rq.params.resource; 
    const payload =  rq.body;
    
    try { 
        const dbAnswer = await deteleItem( resource, payload.id );
        result.body.data = dbAnswer; 
    } catch (err) {
        console.log( err );
        result.status = 400;
        result.body.errCode = _CANT_INSERT_NEW_VALUE_;
        result.body.errMessage = `Can't add new item`;
    }
    rsp.status(result.status).json(result.body);
        
}

export const notificationPostController = async ( rq, rsp ) => {
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

export const notificationGetController = async ( rq, rsp ) => {
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
