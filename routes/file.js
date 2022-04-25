const express = require('express');
const router = express.Router();
const { createUpload } = require('../util/file');
const {requiredLogin} = require('../middlewares/auth');
const controller = require('../controllers/file')
const upload = createUpload();

router.get('/:id/download', controller.download);

router.post(
    '/',
    requiredLogin,
    upload.single('upload'),
    controller.uploadMiddleware,
    controller.upload
);

router.delete('/', requiredLogin, controller.removeFileByUrl);
router.delete('/:id', requiredLogin, controller.removeFileById);

module.exports = router;
