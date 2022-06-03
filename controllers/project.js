const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const createProjectValidator = require("../validators/createProject");
const File = require('../models/file');
const User = require('../models/user');
const Project = require('../models/project');
const {createResponse, createPagingResponse} = require('../util/response');
const {updateFilesOf, removeFilesOf} = require("../services/project");

// 프로젝트 생성
exports.createProject = asyncHandler(async(req, res)   =>{
    const { body,user } = req;

    const validationResult = createProjectValidator(body);
    if(!validationResult) throw createError(400, "유효한 입력이 아닙니다.");
    console.log(body.participants);
    const fileData = body.images? await File.find({'_id' : { $in:
        body.images
    }}): [];
    const userData = body.participants? await User.find({'email': { $in:
        body.participants
    }}) : [];
    body.participants = userData;
    body.images = fileData.filter(file => ['image/gif', 'image/jpeg', 'image/png', 'image/bmp'].includes(file.mimetype)).map(image => image._id);
    body.writer = user;
    const data = await Project.create(body);
    await updateFilesOf(data, user);
    res.json(createResponse(res, '', "게시글이 생성되었습니다."))
})

// 프로젝트 삭제
 exports.deleteProject = asyncHandler(async(req,res) => {
   const{params: { projectId } ,user} = req;
   const exContents = await Project.findById({_id : projectId});
   if(!exContents) throw createError(404,"해당 프로젝트가 존재하지 않습니다.")
   if(String(user._id) !== String(exContents.writer))
   {
       new createError(403, "해당 권한이 없습니다.");
   }
   await Project.deleteOne({_id : projectId});
   await removeFilesOf(exContents, user);
   res.json(createResponse(res, '', "프로젝트가 삭제되었습니다."));
 })

// 프로젝트 수정
exports.updateProject = asyncHandler(async(req, res) => {
    const{params: { projectId }, body , user} = req;
    const exContents = await Project.findById({_id : projectId});
    if(!exContents) throw createError(404,"해당 프로젝트가 존재하지 않습니다.");
    if(String(user._id) !== String(exContents.writer))
    {
        new createError(403, "해당 권한이 없습니다.")
    }
    await Project.updateOne({_id : projectId}, body);
    res.json(createResponse(res, '', "프로젝트가 수정되었습니다."));
})

// 프로젝트들 가져오기
exports.getProjects = asyncHandler(asyncHandler(async(req, res) => {
    const {query, limit, sort, skip} = req;

    const data = await Project.find(query)
        .populate('writer', ['name', 'role'])
        .populate('images', ['filename','url'])
        .populate('participants', ['email', 'name', 'role'])
        .limit(limit).skip(skip).sort(sort);
    res.json(createPagingResponse(res, data.length, data));
}))

// 프로젝트 하나 가져오기
exports.getProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const data = await Project.findOne({_id: projectId})
        .populate('writer', ['name', 'role'])
        .populate('participants', ['email', 'name', 'role'])
        .populate('images', ['filename','url']);
    if(!data) {
        throw createError(404, "해당 프로젝트를 찾을 수 없습니다.");
    }
    res.json(createResponse(res, data));
})
