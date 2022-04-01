const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const { requiredLogin } = require('../middlewares/auth')

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me",requiredLogin,  controller.getme);
router.get("/logout", controller.logout);
router.post("/valid", controller.changeValidEmail);
router.get("/kakao/login", controller.kakaoLogin);
router.post("/mail", requiredLogin, controller.resendMail);
module.exports = router;
