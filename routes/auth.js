const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const { requiredLogin } = require('../middlewares/auth')

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/getme",requiredLogin,  controller.getme);
router.get("/logout", controller.logout);
router.post("/kakao/login", controller.kakaoLogin);
module.exports = router;
