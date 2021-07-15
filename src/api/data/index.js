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

export default router;
