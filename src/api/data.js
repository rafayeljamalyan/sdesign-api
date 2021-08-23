const { Router } =require( 'express');
const formidable =require( 'express-formidable');
const router = Router();

const { crudDeleteController, crudGetController, crudPostController , notificationPostController , notificationGetController} =require( '../controllers/data/index.js');
const { authMiddleware } =require( '../middlewares/auth.js');
const rfileUploader =require( '../middlewares/rfileUploader.js');
const validate =require( '../middlewares/validate.js');

router.get(`/notifications`,  notificationGetController );

router.post(`/notifications`, validate("send-notification") , notificationPostController );


router.get(`/api/:resource`, authMiddleware, crudGetController );
router.get(`/:resource`,   crudGetController );

router.post(`/admin/:resource`, authMiddleware, crudPostController( `json` ) );
router.post(`/:resource`,   crudPostController( `json` ) );

router.delete(`/:resource`, authMiddleware, crudDeleteController );

router.post(`/form/:resource`, authMiddleware, formidable(), rfileUploader, crudPostController( `form` ) );


module.exports = router;
