const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const enrollMemberValidator = require("../validators/enrollMember");
const Post = require('../models/post');
const Project = require('../models/project');
const User = require('../models/user');
const Member = require('../models/member');
const {createResponse} = require('../util/response');

exports.enrollMember = asyncHandler(async(req, res) => {
    const { body, user } = req;
    const validationResult = enrollMemberValidator(body);
    if(!validationResult) throw createError(400, "유효한 입력이 아닙니다.");

    body.writer = user;
    const gitUrl = body.githubUrl? await Project.find({'githubUrl': { $in:
            body.writer}}) : [];
    const projectUrl = body.projectUrl? await Project.find({'projectUrl': { $in:
            body.writer}}) : [];
    body.githubUrl = gitUrl;
    body.projectUrl = projectUrl;
    const data = await Member.create(body);
    res.json(createResponse(res, data, "멤버가 등록되었습니다."));
})

exports.getMembersByProject = asyncHandler(async(req, res)=> {
    const {query, params: {team}} = req;
    if(team!=="Project") throw createError(400, "프로젝트 멤버가 아닙니다.")
    const count = await Member.find(query).count();
    const data = await Member.find({team:'Project'}, query)
        .populate('writer', ['name', 'email', 'role'])
        .populate('projectUrl',['title'])
        .populate('githubUrl', ['writer'])
    req.json({'status': 200, 'message': 'ok', 'success': 'true', count, data});
})

exports.getMembersByTechCourse = asyncHandler(async(req, res)=> {
    const {query, params: {team}} = req;
    if(team!=="TechCourse") throw createError(400, "테크코스 멤버가 아닙니다.")
    const count = await Member.find(query).count();
    const data = await Member.find({team:'TechCourse'}, query)
        .populate('writer', ['name', 'email', 'role'])
        .populate('githubUrl', ['writer'])
    req.json({'status': 200, 'message': 'ok', 'success': 'true', count, data});
})
