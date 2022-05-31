const express = require('express');
const router = express.Router();
const controller = require('../controllers/pomodoro');
const { requiredLogin, verifiedUser, hasRole } = require('../middlewares/auth')

router.post("/", verifiedUser, controller.createPomodoro);
router.post("/:pomodoroId", verifiedUser, controller.finishedPomodoro);
router.get("/ranking/day", controller.getPomodorosRankingByDay);
router.get("/ranking/week", controller.getPomodorosRankingByWeek);
router.get("/ranking/month", controller.getPomodorosRankingByMonth);
router.get("/user/me", verifiedUser, controller.getPomodorosByUser);
router.get("/:pomodoroId", verifiedUser, controller.getPomodoro);
router.get("/", verifiedUser, controller.getPomodorosByUser);
module.exports = router;
