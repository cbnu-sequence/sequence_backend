const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const createPostValidator = require("../validators/createPost");
const Post = require('../models/post');
const File = require('../models/file');
const {createResponse, createPagingResponse} = require('../util/response');
const {updateFilesOf, removeFilesOf, validateCategory1, validateCategory2} = require('../services/post');

//Post Create
exports.createPost = asyncHandler(async(req, res)   =>{
    const { body, body: {category: category2} ,user, params: { category: category1 }} = req;

    if(!validateCategory1(category1)) {
        throw createError(400, '해당 카테고리는 존재하지 않습니다.');
    }
    if(category2 != null && !validateCategory2(category1, category2)) {
        throw createError(400, "해당 세부 카테고리가 존재하지 않습니다.");
    }
    const validationResult = createPostValidator(body);
    if(!validationResult) throw createError(400, "유효한 입력이 아닙니다.");
    const exData = body.files? await File.find({'_id' : { $in:
        body.files
            }}): [];
    if(!category2) {
        body.category2 = null;
    } else {
        body.category2 = category2;
    }

    body.category1 = category1;
    body.images = exData.filter(
        file => [
            'image/gif', 'image/jpeg', 'image/png', 'image/bmp'
        ].includes(file.mimetype)).map(image => image._id);
    body.files = exData.filter(
        file => ![
            'image/gif', 'image/jpeg', 'image/png', 'image/bmp'
        ].includes(file.mimetype)).map(file => file._id);
    body.writer = user;

    const data = await Post.create({...body, writer: user._id});
    user.posts.push(data._id);
    await user.save();
    await updateFilesOf(data, user);

    res.json(createResponse(res, '', "Document created"))
})

//Post Delete
 exports.deletePost = asyncHandler(async(req,res) => {
   const{params: { id } ,user} = req;
   const exContents = await Post.findById(id);
   if(!exContents) throw createError(404,"해당 게시글이 존재하지 않습니다.")

   if(String(user._id) === String(exContents.writer)) {
    await Post.deleteOne({_id:id});
    await removeFilesOf(exContents, user);
    user.posts.pop(exContents._id);
    await user.save();
    res.json(createResponse(res, '', "Document deleted"))
   } else {
       throw createError(403, "해당 게시글에 접근할 수 없습니다.");
   }
 })

exports.updatePost = asyncHandler(async(req, res) => {
    const{params: { id }, body , user} = req;
    const exContents = await Post.findById(id);
    if(!exContents) throw createError(404,"해당 게시글이 존재하지 않습니다.");
    if(String(user._id) === String(exContents.writer))
    {
        await Post.updateOne({_id:id}, body);
        res.json(createResponse(res, '', "Document updated"));
    } else {
        throw createError(403, "해당 게시글에 접근할 수 없습니다.");
    }
})

exports.getPosts = asyncHandler(asyncHandler(async(req, res) => {
    const { params: {category}, limit, skip, sort } = req;

    if(!validateCategory1(category)) {
        throw createError(400, '해당 카테고리가 존재하지 않습니다.');
    }

    const data = await Post.find({category1 : category})
        .populate('writer', ['name', 'role'])
        .populate('files', ['filename','url'])
        .populate('images', ['filename','url'])
        .limit(limit).skip(skip).sort(sort);

    const count = await Post.find({category1 : category}).count();
    res.json(createPagingResponse(res, count, data));
}))

exports.getPost = asyncHandler((asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const data = await Post.findOne({_id: postId})
        .populate('writer', ['name', 'role'])
        .populate('files', ['filename','url'])
        .populate('images', ['filename','url']);

    if(!data) {
        throw createError(404, "해당 게시글을 찾을 수 없습니다.");
    }

    res.json(createResponse(res, data));
})))

exports.getPostsByCategory = asyncHandler((asyncHandler(async (req, res) => {
    const { params: {category1, category2}, limit, skip, sort } = req;

    if(!validateCategory1(category1) || !validateCategory2(category1, category2)) {
        throw createError(400, '해당 카테고리를 찾을 수 없습니다.');
    }

    const data = await Post.find({category1, category2})
        .populate('writer', ['name', 'role'])
        .populate('files', ['filename','url'])
        .populate('images', ['filename','url'])
        .limit(limit).skip(skip).sort(sort);

    const count = await Post.find({category1, category2}).count();

    res.json(createPagingResponse(res, count, data));
})))
