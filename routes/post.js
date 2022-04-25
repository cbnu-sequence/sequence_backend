const express = require('express');
const router = express.Router();
const controller = require('../controllers/post');
const { requiredLogin } = require('../middlewares/auth')
// Posting Relevant
router.post('/:category', requiredLogin, controller.createPost);//ok
router.delete('/:category/:id', requiredLogin, controller.deletePost);
router.post('/:category/:id', requiredLogin, controller.updatePost);
router.get('/:category', controller.getPosts);
router.get('/:category/:postId', controller.getPost);
// Comments Relevant
//router.post('/posts/:id/comments', requireLoggedIn, controller.createComments);
//router.delete('/posts/:id/comments/:commentsID', requireLoggedIn, controller.deleteComments);
module.exports = router;