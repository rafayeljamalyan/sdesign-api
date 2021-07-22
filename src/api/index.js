import { Router } from 'express';
const router = Router();

import routes from './routes.js';
import { authMiddleware } from './../middlewares/auth.js';
import { emailSend } from '../middlewares/emailSend.js';
import validate from '../middlewares/validate.js';
// const auth = require(`./../middlewares/auth`);

// config routes
routes.forEach( route =>{
    if( route.needAuth ) {
        router.use( route.path, authMiddleware );
    }
    router.use( route.path, route.router );
});

router.post(`/send-msg`, validate("send-notification"), emailSend);

export default router;
