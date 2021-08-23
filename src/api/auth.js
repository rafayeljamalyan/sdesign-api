// deps
const { Router } = require('express');

const { loginController, resetPasswordController, startResetPasswordController, verifyResetPasswordController } = require('../controllers/auth/index.js');
const validate = require('../middlewares/validate.js');

const router = Router();

router.post( `/login`, validate(`login`), loginController );

router.post( `/start-reset-password`, validate( `start-reset-password` ), startResetPasswordController );

router.post( `/verify-reset-password`, validate( `verify-reset-password` ), verifyResetPasswordController );

router.post( `/reset-password`, validate( `reset-password` ), resetPasswordController );

module.exports = router;
