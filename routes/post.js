const express = require('express');
const router = express.Router();
const controller = require('../controllers/post');
const { requiredLogin } = require('../middlewares/auth')
// Posting Relevant
router.post('', requiredLogin, controller.createPost);//ok
router.delete('/:id', requiredLogin, controller.deletePost);
router.post('/:id', requiredLogin, controller.updatePost);
router.get('', controller.getPosts);
router.get('/:postId', controller.getPost);
// Comments Relevant
//router.post('/posts/:id/comments', requireLoggedIn, controller.createComments);
//router.delete('/posts/:id/comments/:commentsID', requireLoggedIn, controller.deleteComments);
module.exports = router;