import { getResponseTemplate } from "../../lib/r-back.lib";
import { _RESOURCE_NOT_FOUND_ } from "../../providers/error-codes";
import { getData } from "./data-helpers";

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
