import { Router } from 'express';
const router = Router();

import routes from './routes';
import { authMiddleware } from './../middlewares/auth';
import { emailSend } from '../middlewares/emailSend';
import validate from '../middlewares/validate';
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
