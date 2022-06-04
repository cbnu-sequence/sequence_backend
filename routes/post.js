const express = require('express');
const router = express.Router();
const controller = require('../controllers/post');
const { requiredLogin, verifiedUser } = require('../middlewares/auth')
const {pagingList} = require("../middlewares/page");
// Posting Relevant
router.post('/:category', verifiedUser, controller.createPost);//ok
router.delete('/:category/:id', verifiedUser, controller.deletePost);
router.post('/:category/:id', verifiedUser, controller.updatePost);
router.get('/:category', pagingList, controller.getPosts);
router.get('/:category/:postId', controller.getPost);
router.get('/:category1/category/:category2', pagingList, controller.getPostsByCategory)

module.exports = router;
