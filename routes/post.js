const { Router } = require('express');
const controller = require('../controllers/post');
const { requireLoggedIn, isAdmin } = require('../middlewares/auth')
const router = Router();
// Posting Relevant
router.post('/posts', requireLoggedIn, controller.createPost);//ok 
router.delete('/posts/:id', requireLoggedIn, controller.deletePost)
// Comments Relevant
router.post('/posts/:id/comments', requireLoggedIn, controller.createComments);
router.delete('/posts/:id/comments/:commentsID', requireLoggedIn, controller.deleteComments);
module.exports = router;

// View Posting
router.get('/posts/:id', function(req,res){
    Post.findById(req.params.id)
    .populate(['writer','comments.writer'])
    .exec(function (err,posts) {
      if(err) return res.json({success:false, message:err});
      posts.views++;
      posts.save();
      res.render("posts/show", {post:posts, urlQuery:req._parsedUrl.query,
        user:req.user, search:createSearch(req.query)});
    });
  });