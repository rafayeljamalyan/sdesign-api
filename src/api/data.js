import { Router } from 'express';
const router = Router();
import { crudGetController } from '../controllers/data';
import { authMiddleware } from '../middlewares/auth';


router.get(`/:resource`, authMiddleware, crudGetController );

export default router;
