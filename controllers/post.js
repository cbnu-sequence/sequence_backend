const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const createPostValidator = require("../validators/createPost");
const Post = require('../models/post');
const {createResponse} = require('../util/response');
const {updateFilesOf, assignTo} = require('../services/post')
// User Relevant Controllers
// exports.findUsers = asyncHandler(async (req, res) => {
//   const { query: { page, limit } } = req;
//   const _page = +(page || 1);
//   const _limit = +(limit || 10);
//   const skip = (page - 1) * limit;
//   const total = await User.countDocuments({ role: 'User' });
//   const documents = await User.find({})
//   .skip(skip).limit(_limit);
//   res.json({ total, page: _page, limit: _limit, data: documents })
// });
//
// //User Information find
// exports.findUser = asyncHandler(async (req, res) => {
//   const { params: { id } } = req;
//   const user = await User.findById(id).select('-hashedPassword');
//   if (!user) throw createError(404, 'User Not Found');
//   res.json({ success: true, status: 200, message: `User ${id} Data`, data: user });
// });
//
// //User Update
// exports.updateUser = asyncHandler(async (req, res) => {
//   const { body: $set, params: { id } } = req;
//   delete $set.role;
//   const nicknameDuple = await User.findOne({nickname: $set.nickname});
//   const emailDuple = await User.findOne({email: $set.email});
//   const user = await User.findById(id);
//   if (!user) throw createError(404, 'User Not Found');
//   if (emailDuple) throw createError(403, 'Email Already In Use');
//   if (nicknameDuple) throw createError(403, 'Nickname Already In Use');
//   await user.updateOne({ $set });
//   res.json({ success: true, status: 200, message: 'User Info Updated' });
// });

//Post Create
exports.createPost = asyncHandler(async(req, res) =>{
  const { body ,user} = req;
    const validationResult = createPostValidator(body);
    if(validationResult !== true) throw createError(400, "Validation Failed");
    const data = await Post.create({...body, writer: user._id});
    user.posts.push(data._id);
    await user.save();
  res.json(createResponse(res, '', "Document created"))
})

//Post Delete
 exports.deletePost = asyncHandler(async(req,res) => {
   const{params: { id } ,user} = req;
   const exContents = await Post.findById(id)
   if(!exContents) throw createError(404,"Documents Not Foud")
   if(user._id.equals(exContents.writer))
   {
    await Post.deleteOne({_id:id})
    res.json(createResponse(res, '', "Document updated"))
   }
 })

exports.updatePost = asyncHandler(async(req, res) => {
    const{params: { id }, body , user} = req;
    const exContents = await Post.findById(id);
    if(!exContents) throw createError(404,"Documents Not Found");
    if(user._id.equals(exContents.writer))
    {
        await Post.updateOne({_id:id}, body);
        res.json(createResponse(res, '', "Document updated"));
    } else {
        throw createError(403, "no authentication");
    }
})

exports.getPosts = asyncHandler(asyncHandler(async(req, res) => {
    const page = (req.query.page || 1);
    const limit = (req.query.limit || 10);
    const sort = req.query.sort || undefined;
    const skip = limit * ((isNaN(page) ? 1 : page) - 1);

    const data = await Post.find().populate('writer').limit(limit).skip(skip).sort(sort);
    res.json(createResponse(res, data));
}))

exports.getPost = asyncHandler((asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const data = await Post.find({_id: postId}).populate('writer');
    if(!data) {
        throw createError(404, "no Post");
    }
    res.json(createResponse(res, data));
})))


//  //Comment Create
//   exports.createComments = asyncHandler(async(req, res) =>{
//   const { body ,user } = req;
//   const exUser = await User.findById(user._id);
//   const kortime = new Date();
//   const realtime = new Date(kortime)
//   realtime.setHours(realtime.getHours() + 9); // export to db in asia/seoul time zone
//   await Post.update(body.comments,{$set: {body:contents,writer:exUser.name,createdAt:realtime}});
//   res.json({ success: true, status: 200, message: 'Comment created!'})
// })
//xx
// //Comment Delete
// exports.deleteComments = asyncHandler(async(req,res) => {
//   const{params: { id } ,user}=req;
//   const exUser = await User.findById(user._id);
//   const exContents = await Post.comments.findById(id)
//   console.log(exContents)
//   if(!exContents) throw createError(404,"Comments Not Foud")
//   if(exUser.name===exContents.writer)
//   {
//    await Post.comments.deleteOne({_id:id})
//    res.json({success: true, status:200, message: "Comment Deleted"})
//   }
// })