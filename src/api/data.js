import { Router } from 'express';
const router = Router();
import { crudDeleteController, crudGetController, crudPostController , notificationPostController , notificationGetController} from '../controllers/data';
import { authMiddleware } from '../middlewares/auth';
import rfileUploader from '../middlewares/rfileUploader';
import formidable from 'express-formidable';
import validate from '../middlewares/validate';

router.get(`/notifications`,  notificationGetController );

router.post(`/notifications`, validate("send-notification") , notificationPostController );


router.get(`/api/:resource`, authMiddleware, crudGetController );
router.get(`/:resource`,   crudGetController );

router.post(`/admin/:resource`, authMiddleware, crudPostController( `json` ) );
router.post(`/:resource`,   crudPostController( `json` ) );

router.delete(`/:resource`, authMiddleware, crudDeleteController );

router.post(`/form/:resource`, authMiddleware, formidable(), rfileUploader, crudPostController( `form` ) );



export default router;
