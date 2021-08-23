const Router = require('express').Router;
const router = Router();

const routes = require('./routes.js');
const { authMiddleware } = require('./../middlewares/auth.js');
const { emailSend } = require('../middlewares/emailSend.js');
const validate = require('../middlewares/validate.js');
// const auth = require(`./../middlewares/auth`);

// config routes
routes.forEach( route =>{
    if( route.needAuth ) {
        router.use( route.path, authMiddleware );
    }
    router.use( route.path, route.router );
});

router.post(`/send-msg`, validate("send-notification"), emailSend);

module.exports = router;
