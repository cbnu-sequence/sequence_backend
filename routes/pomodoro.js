const express = require('express');
const router = express.Router();
const controller = require('../controllers/pomodoro');
const { requiredLogin, verifiedUser, hasRole } = require('../middlewares/auth')

router.post("/", verifiedUser, controller.createPomodoro);
router.post("/:pomodoroId", verifiedUser, controller.finishedPomodoro);
module.exports = router;
