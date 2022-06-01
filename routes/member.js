const express = require('express');
const router = express.Router();
const controller = require('../controllers/member');
const { requiredLogin, verifiedUser } = require('../middlewares/auth')

router.post('/', verifiedUser, controller.enrollMember);
router.get('/:team', controller.getMembersByProject);
router.get('/:team', controller.getMembersByTechCourse);

module.exports = router;
