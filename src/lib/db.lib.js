/** created by r
 *  02-03-21
 *  17:02
 */

// internal dependencies
import { _UNKNOWN_ERROR_ } from '../providers/error-codes';
import { db } from  './../providers/db';

export const get = ( table, params, specificColumns = [], limits = ``, orderColumns = [] ) => new Promise( ( rslv, rjct ) =>{
    const selectQuery = getSelectQuery( table, params, specificColumns, limits, orderColumns );
    db.query( selectQuery, ( err, data ) => {
        if ( err ) 
            rjct({
                errCode: _UNKNOWN_ERROR_,
                errMessage: `Can't get data from db`
            })
        
        else 
            rslv(data);
        
    });
});

export const exec = ( query, params = [] ) => new Promise( (rslv, rjct) =>{
    if( params && params.length > 0 ) {
        query = db.format( query, params );
    }
    db.query( query, ( err, res ) => {
        if ( err )
            rjct( {
                errMessage: `Can't execute query: ${ query }`,
                errCode: _UNKNOWN_ERROR_
            });
        else
            rslv( res );
    });
});

export const getDataStructure = table => new Promise( async ( rslv, rjct ) =>{
    const result = {};
    const structureQuery = getDataStructureQuery( table );
    try {
        result.structure = await exec( structureQuery );
        const itemsHavingReference = result.structure.filter( structItem => structItem.type === `select_from_other_resource` );
        if( itemsHavingReference && itemsHavingReference.length > 0 ) {
            result.additionalData = await getAdditionalDataForReferenceHavingRows( itemsHavingReference );
        }
        rslv( result );
    }
    catch (err) {
        rjct( err );
    }
});

export const getDataStructureQuery = key => {
    const query = `SELECT ${ getColumnsToSelect( [ `inputs.id`,`table-name`,`col-name`,`disabled`, `required`, `reference-table` ] ) }, \`title\` as 'type' FROM \`inputs\`
                    LEFT JOIN \`input-types\` ON \`input-types\`.\`id\`=\`inputs\`.\`type-id\`
                    WHERE \`table-name\`=${db.format(`?`,[[key]])}
                    ORDER BY \`inputs\`.\`id\`;`;
    return query;
};

export const add = ( table, data ) => new Promise( async ( rslv, rjct ) => {
    if( JSON.stringify( data ).length > 2 ) {
        const insertQuery = getInsertQuery( table, Object.keys( data ), Object.values( data ) );
        try{
            const insertResult = await exec( insertQuery );
            rslv( insertResult );
        }
        catch( err ) {
            rjct( err );
        }
    }
    else {
        rjct({
            errCode: _UNKNOWN_ERROR_,
            errMessage: `Can't add new data item, possible reason: wrong params`
        })
    }
});

export const update = ( table, id, data ) => new Promise( async( rslv, rjct ) =>{
    let updateQuery = db.format( `UPDATE ?? SET `, [ table ]);
    updateQuery += getUpdateQueryKeyValuesPart( data );
    updateQuery += db.format( `WHERE \`id\` = ?;`, [ id ] );
    try {
        await exec( updateQuery );
        rslv();
    }
    catch( err ) {
        err.errMessage = `Can't update item with id ${ id }`;
        rjct( err );
    }
});

export const deleteFromTable = ( table, id, field = null ) => new Promise( async ( rslv, rjct ) =>{
    const deleteQuery = getDeleteQuery( table, id, field );
    try{
        await exec( deleteQuery );
        rslv( `ok` );
    }
    catch (err) {
        err.errMessage = `Can't delete item with ${field ? `field` :  `id`} ${ field ? field: id} from table ${ table } `;
        rjct( err );
    }
});

export const count = ( table, query = {} ) => new Promise( async (rslv, rjct) => {
	let limits = ``;
	if ( query && JSON.stringify( query ) !== "{}" ) {
		limits = ` WHERE `;
		Object.entries( query ).forEach( ( keyValuePair, i, arr) => {
			limits += db.format(`??=?`, keyValuePair );
			if ( i < arr.length - 1 )
				limits += ` AND `;
		})
	}
	try {
		const rslt = await exec( db.format( `SELECT COUNT( * ) as c FROM ?? ${limits}` ), table );
		if ( Array.isArray( rslt ) && rslt.length > 0 )
			rslv( rslt[0].c );
		else
			rslv( 0 );
	}
	catch( err ) {
		rjct( err );
	}


})

export function getTableInfoQuery (db,table){
    return  " SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='"+db+"'  AND `TABLE_NAME`='"+table+"'";
}
/** r_function */
function getInsertQuery ( table, fields, values ) {
    let insertQuery = `INSERT INTO ?? ( ${ getColumnsToSelect( fields ) } ) VALUES ( ${ getValuePlaceholdersForSqlQueries( values.length ) } );`;
    insertQuery = db.format( insertQuery, [ table, ...values ] )
    return insertQuery;
}

/** r_function */
function getValuePlaceholdersForSqlQueries ( quantity ) {
    let res = ``;
    for ( let i = 0; i < quantity; i++ )
        res += `?,`;
    if( res.length > 0 )
        res = res.slice( 0, -1 );
    return res;
}

/** r_function */
function getColumnsToSelect ( columns ) {
    if ( columns.length == 0 || !columns || !( columns instanceof Array ) )
        return `*`;
    else {
        let result = ``;
        columns.forEach( () => {
            result += `??,`
        });
        // result length is 100% more than 1
        result = result.slice( 0, -1 );
        return db.format( result, columns );
    }
}

/** r_function
 * @param columns must be array
 * and have at least one element
*/
function getColumnsForOrdering ( columns ) {
    let result = ``;
    columns.forEach( () => {
        result += `??,`
    });
    // result length is 100% more than 1
    result = result.slice( 0, -1 );
    return db.format( result, columns );
}

/** r_function */
function getSelectQuery ( table, params, specificColumns = [], limits = ``, orderColumns = [] ) {
    return `
    SELECT ${getColumnsToSelect( specificColumns )}
    FROM ${ db.format( `??`, [ table ] ) }
    ${ limits }
    ${ orderColumns.length > 0 && orderColumns instanceof Array ? `
        ORDER BY ${ getColumnsForOrdering( orderColumns ) }
        ${params[`order-type`] ? params[`order-type`].toUpperCase() : ``}
    ` : `` }
    `.trim();
}

/** r_function */
function getAdditionalDataForReferenceHavingRows ( rows ) {
    return new Promise( (rslv, rjct) => {
        const queries = [];
        const neededTables = Array.from(
            new Set( rows.map( rowdata => rowdata[`reference-table`]) )
        );
        neededTables.forEach( table => {
            queries.push( get( table ) );
        });

        Promise.all( queries )
            .then( answers => {
                const otherResources = {};
                neededTables.forEach( ( table, i ) => {
                    otherResources[ table ] = answers[i];
                });
                rslv( { otherResources } );
            })
            .catch( err => {
                console.log( err );
                rjct({
                    statusCode: 501,
                    errCode: 51,
                    errMessage: `can't execute all queries`
                })
            });
    });
}

/** r_function */
function getUpdateQueryKeyValuesPart ( data ) {
    const res = Object.entries( data ).reduce( ( res, item ) =>{
        return res+= db.format( `??=?,`,[[item[0]],[item[1]]] );
    }, ``);

    return res.slice(0,-1);
}

/** r_function */
function getDeleteQuery ( table, id, field = null ) {
    let query = db.format( `DELETE FROM ?? `, [ table ] );
    if ( field ) {
        query += db.format( ` WHERE \`${field}\`= ? `, [ id ] );
    }
    else {
        query += db.format( ` WHERE \`id\`= ? `, [ id ] );
    }
    return query;
}
