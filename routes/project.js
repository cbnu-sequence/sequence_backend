const express = require('express');
const router = express.Router();
const controller = require('../controllers/project');
const { requiredLogin, hasRole, verifiedUser } = require('../middlewares/auth')

router.post("/", verifiedUser, controller.createProject);
router.put("/:projectId", verifiedUser, controller.updateProject);
router.delete("/:projectId", verifiedUser, controller.deleteProject);
router.get("/", controller.getProjects);
router.get("/:projectId", controller.getProject);

module.exports = router;
