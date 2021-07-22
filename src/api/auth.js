// deps
import { Router } from 'express';
import { loginController, resetPasswordController, startResetPasswordController, verifyResetPasswordController } from '../controllers/auth/index.js';
import validate from '../middlewares/validate.js';
const router = Router();

router.post( `/login`, validate(`login`), loginController );

router.post( `/start-reset-password`, validate( `start-reset-password` ), startResetPasswordController );

router.post( `/verify-reset-password`, validate( `verify-reset-password` ), verifyResetPasswordController );

router.post( `/reset-password`, validate( `reset-password` ), resetPasswordController );

export default router;
