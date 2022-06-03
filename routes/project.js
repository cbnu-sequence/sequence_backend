const express = require('express');
const router = express.Router();
const controller = require('../controllers/project');
const { requiredLogin, hasRole, verifiedUser } = require('../middlewares/auth')
const {pagingList} = require("../middlewares/page");

router.post("/", hasRole, controller.createProject);
router.put("/:projectId", hasRole, controller.updateProject);
router.delete("/:projectId", hasRole, controller.deleteProject);
router.get("/", pagingList, controller.getProjects);
router.get("/:projectId", controller.getProject);

module.exports = router;
