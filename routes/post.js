const express = require('express');
const router = express.Router();
const controller = require('../controllers/post');
const { requiredLogin, verifiedUser } = require('../middlewares/auth')
// Posting Relevant
router.post('/:category', verifiedUser, controller.createPost);//ok
router.delete('/:category/:id', verifiedUser, controller.deletePost);
router.post('/:category/:id', verifiedUser, controller.updatePost);
router.get('/:category', controller.getPosts);
router.get('/:category/:postId', controller.getPost);
router.get('/:category1/category/:category2', controller.getPostsByCategory)
// Comments Relevant
//router.post('/posts/:id/comments', requireLoggedIn, controller.createComments);
//router.delete('/posts/:id/comments/:commentsID', requireLoggedIn, controller.deleteComments);
module.exports = router;
