const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const enrollMemberValidator = require("../validators/enrollMember");
const User = require('../models/user');
const Member = require('../models/member');
const {createResponse, createPagingResponse} = require('../util/response');
const {verifyTeam, verifyParts} = require("../services/member");

exports.changeMemberByUser = asyncHandler(async(req, res) => {
    const { body, user } = req;

    const validationResult = enrollMemberValidator(body);
    if(!validationResult) throw createError(400, "유효한 입력이 아닙니다.");

    if(body.team || body.part) {
        throw createError(403, "팀이나 파트를 변경하실 수 없습니다.");
    }

    const data = await Member.findOne({user});
    if(!data) {
        if(!user) {
            throw createError(400, "해당 유저를 찾을 수 없습니다.");
        }
        const member = await Member.create({user, ...body});
        user.member = member._id;
        await user.save();
    } else {
        await Member.updateOne({user}, body);
    }

    res.json(createResponse(res, '', "멤버가 수정되었습니다."));
})

exports.changeMemberByAdmin = asyncHandler(async(req, res) => {
    const { body } = req;

    if(body.team){
        verifyTeam(body.team);
    }
    if(body.part) {
        verifyParts(body.part);
    }

    const user = await User.findOne({email: body.email});

    if(!user) {
        throw createError(400, "해당 유저를 찾을 수 없습니다.");
    }

    const member = await Member.findOne({user});
    if(!member) {
        const doc = await Member.create({user, ...body});
        await User.updateOne({_id : user}, {member: doc});
    } else {
        await Member.updateOne({user}, body);
    }

    res.json(createResponse(res, '', "멤버가 수정되었습니다."));
})

exports.getMembersByTeam = asyncHandler(async(req, res)=> {
    const {params, query} = req;

    const data = await Member.find({...params, ...query})
        .populate('user', ['name', 'email', 'role'])

    res.json(createResponse(res, data));
})

exports.connectUsersAndMembers = asyncHandler( async(req, res) => {
    const members = await Member.find({});
    members.map(async member => {
        const exUser = await User.findOne({member: member._id});
        if(!exUser) {
            const user = await User.findById(member.user);
            if(!user) {
                console.log(member.user);
            } else {
                user.member = member._id;
                await user.save();
            }
        }
    })
    res.json(createResponse(res));
})
