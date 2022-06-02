const express = require('express');
const router = express.Router();
const controller = require('../controllers/member');
const { requiredLogin, verifiedUser, hasRole} = require('../middlewares/auth')

router.post('/user', verifiedUser, controller.changeMemberByUser);
router.post('/admin', hasRole, controller.changeMemberByAdmin);
router.get('/:team', controller.getMembersByTeam);

module.exports = router;
