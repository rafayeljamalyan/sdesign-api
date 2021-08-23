/** created by r
 *  12-03-21
 *  12:51
 */

// deps
const validator = require("validator");

const validators = {
    required: checkRequired,
    email: checkEmail,
    minLength: (...params)=>checkLength(`min`,...params),
    maxLength: (...params)=>checkLength(`max`,...params),
    isOneOf: checkIsOneOf,
		date: checkDate,
		time: checkTime
}

function checkRequired ( value ) {
    const result = { valid: false, message: `` }
    if ( value != null && value != undefined ){
        result.valid = (value + ``).length > 0;
    }
    if ( !result.valid )
        result.message = `value is required`;
    return result;
}

function checkEmail ( value ) {
    const result = { valid: false, message: `` }
    if ( validator.isEmail(value) ){
        result.valid = true;
    }
    else {
        result.message = `email is not in correct format`
    }
    return result;
}

function checkTime( value ) {
	const result = { valid: false, message: `` };
	const errMessage = `Time is not in correct format`;
	const timeItems = (value+'').split(`:`);
	if ( (timeItems.length === 2 || timeItems.length === 3) && timeItems.reduce( (valid, item) => valid && item.length <= 2, true ) ){
		const [ hours, minutes ] = timeItems.map( el => parseInt(el) );
		if( !Number.isNaN( hours ) && !Number.isNaN( minutes ) ) {
			if ( hours < 24 && minutes < 60 )
				result.valid = true;
			else
				result.message = errMessage;
		}
		else
			result.message = errMessage;
	}
	else {
			result.message = errMessage;
	}
	return result;
}

function checkLength ( type, value, length ) {
    const result = { valid: false, message: `` };
    const options = {};
    if( type === `min` ){
        options.min = length;
    }
    if( type === `max` ){
        options.max = length;
    }

    if ( validator.isLength( (value + ``) , options )){
        result.valid = true;
    }
    else {
        result.message = `value must have ${type===`min`?'at least':type===`max`?'maximum':''} ${ length } characters `
    }
    return result;
}

function checkIsOneOf ( value, possibleValues ) {
    const result = { valid: true, message: `` };
    if( possibleValues instanceof Array && possibleValues.indexOf( value ) === -1 ) {
        result.valid = false;
        result.message = `${value} doesn't belong to  [${ possibleValues }].`;
    }
    return result;
}

function checkDate ( value ) {
	const result = { valid: false, message: `` };
	if ( validator.isDate( value ) ){
		result.valid = true;
	}
	else {
		result.message = `date is not in correct format`;
	}
	return result;
}

exports.validate = ( value, vldtrs ) => {
    const result = { valid: true, messages: [] };
    if ( typeof vldtrs === `object` ) {
        const vldtrEntries = Object.entries( vldtrs );
        for (let i = 0; i < vldtrEntries.length; i++) {
            const [ key, val ] = vldtrEntries[i];
            if ( key in validators && ( [ null, undefined, false ].indexOf( val ) === -1 ) ) {
                if ( typeof validators[key] === `function` ) {
                    const validState = validators[key]( value, val );
                    if ( !validState.valid ){
                        result.valid = false;
                        result.messages.push( validState.message )
                    }
                }
            }
        }

    }
    return result;
}

exports.validateObject = ( object, config ) => {
    const result = { valid: true, messages: {} };

    if ( typeof config === `object` ) {
        const keys = Object.keys( config )
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // if key doesnt exist in object it will pass empty string
            const itemValidState = exports.validate( object[key] || ``, config[key] );
            if ( !itemValidState.valid ){
                result.valid = false;
                result.messages[key] = itemValidState.messages;
            }
        }
    }

    return result;
}
 
