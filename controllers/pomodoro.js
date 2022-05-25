const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const Pomodoro = require('../models/pomodoro');
const {createResponse} = require('../util/response');

//뽀모도로 만들기(첫번째 요청)
exports.createPomodoro = asyncHandler(async(req, res)   =>{
    const { body, user } = req;
    if(!body.title) {
        new createError(400, "제목을 찾을 수 없습니다.");
    }
    const doc = await Pomodoro.create({...body, writer : user}, {});
    res.json(createResponse(res, doc, "뽀모도로가 생성되었습니다."));
})

//뽀모도로 제출(두번째 요청)
exports.finishedPomodoro = asyncHandler(async(req, res)   =>{
    const { user, params: {pomodoroId} } = req;
    if(!pomodoroId) {
        new createError(400, "제목을 찾을 수 없습니다.");
    }
    const doc = await Pomodoro.findOne({_id : pomodoroId});
    if(String(user._id) !== String(doc.writer))
    {
        new createError(403, "해당 권한이 없습니다.")
    }
    if(!doc) {
        new createError(404, "해당 id의 뽀모도로를 찾을 수 없습니다.")
    }
    if((new Date(Date.now()).getTime() - doc.createdAt.getTime()) / 1000 / 60 < 25) {
        new createError(400, "뽀모도로의 시간이 지나지 않았습니다.");
    }
    await Pomodoro.updateOne({_id : pomodoroId}, {isFinished : true});
    res.json(createResponse(res, '', "뽀모도로가 완료되었습니다."));
})

