import { Router } from 'express';
const router = Router();
import { crudDeleteController, crudGetController, crudPostController } from '../controllers/data';
import { authMiddleware } from '../middlewares/auth';
import rfileUploader from '../middlewares/rfileUploader';
import formidable from 'express-formidable';


router.get(`/:resource`, authMiddleware, crudGetController );

router.post(`/:resource`, authMiddleware, crudPostController( `json` ) );

router.delete(`/:resource`, authMiddleware, crudDeleteController );

router.post(`/form/:resource`, authMiddleware, formidable(), rfileUploader, crudPostController( `form` ) );

export default router;
