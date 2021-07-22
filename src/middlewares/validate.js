import { getResponseTemplate } from "../lib/r-back.lib.js";
import { _UNEXPECTED_PARAMS_, _WRONG_PARAMS_ } from "../providers/error-codes.js";
import { validateObject } from "../providers/validator.js";

const requestValidations = {
	'login': {
		'email': { required: true, email: true },
		'password': { required: true, minLength: 8 }
	},
	'start-reset-password': {
		'email': { required: true, email: true }
	},
	'verify-reset-password': {
		'resetCode': { required: true }		
	},
	'reset-password': {
		'new-password': { required: true, minLength: 8 }
	},
	'send-notification': {
		'sender-email': { required: true, email: true }, 
		"content": {required: true},
	}
}

const expectedItems = {};

const validate = type => ( rq, rsp, next ) => { 
	if ( type in requestValidations ) {
		const result = getResponseTemplate();
    	const { valid:isValid, messages:validationMessages } = validateObject( rq.body, requestValidations[type]);
		if ( isValid ) {
			const hasUnexpectedItems = !(type in expectedItems) || Object.keys( rq.body ).reduce( ( res, el ) => res && expectedItems[type].includes( el ), true );
			if ( !hasUnexpectedItems ){
				result.body.errCode = _UNEXPECTED_PARAMS_;
				result.body.errMessage = `Unexpected params`;
				result.body.data = {};
				rsp.status( 406 ).json( result.body );
			}
			else next();
		}
		else {
			
			result.body.errCode = _WRONG_PARAMS_;
			result.body.errMessage = `Wrong params`;
			result.body.data = validationMessages;
			rsp.status( 406 ).json( result.body );
		}
	}
	else
		next();
}

export default validate;
