import { Router } from 'express';
const router = Router();

import routes from './routes';
import { authMiddleware } from './../middlewares/auth';
// const auth = require(`./../middlewares/auth`);

// config routes
routes.forEach( route =>{
    if( route.needAuth ) {
        router.use( route.path, authMiddleware );
    }
    router.use( route.path, route.router );
});

export default router;
