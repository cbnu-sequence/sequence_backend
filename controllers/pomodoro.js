const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const Pomodoro = require('../models/pomodoro');
const {createResponse} = require('../util/response');
const {getPomodorosRankingByTime, getWeekFirstDay, getWeekLastDay} = require("../services/pomodoro");

//뽀모도로 만들기(첫번째 요청)
exports.createPomodoro = asyncHandler(async(req, res)   =>{
    const { body, user, body: {date : startDate} } = req;

    if(!body.title) {
        throw createError(400, "제목을 찾을 수 없습니다.");
    }
    if(!startDate) {
        throw createError(400, "시간을 찾을 수 없습니다.");
    }

    const lastDoc = await Pomodoro.find({
        writer: user,
        isFinished: true
    }).sort("-endDate").limit(1);

    let sequence = 1;
    if(lastDoc.length != 0) {
        if((new Date(startDate).getTime() - lastDoc[0].endDate.getTime()) / (60 * 1000) <= 7) {
            sequence = lastDoc[0].sequence + 1;
        }
    }

    const doc = await Pomodoro.create({...body, writer : user, startDate, endDate: startDate, sequence});
    const response = {
        _id : doc._id,
        startDate: doc.startDate,
    }
    res.json(createResponse(res, response, "뽀모도로가 생성되었습니다."));
})

//뽀모도로 제출(두번째 요청)
exports.finishedPomodoro = asyncHandler(async(req, res) => {
    const { user, params: {pomodoroId}, body: {date: endDate} } = req;

    if(!pomodoroId) {
        throw createError(400, "제목을 찾을 수 없습니다.");
    }
    if(!endDate) {
        throw createError(400, "시간을 찾을 수 없습니다.");
    }

    const doc = await Pomodoro.findOne({_id : pomodoroId});

    if(String(user._id) !== String(doc.writer)) {
        throw createError(403, "해당 권한이 없습니다.");
    }
    if(!doc) {
        throw createError(404, "해당 id의 뽀모도로를 찾을 수 없습니다.");
    }
    if(doc.isFinished) {
        throw createError(400, "이미 완료하였습니다.");
    }

    await Pomodoro.updateOne({_id : pomodoroId}, {isFinished : true, endDate});

    res.json(createResponse(res, '', "뽀모도로가 완료되었습니다."));
})

exports.getPomodorosRankingByDay = asyncHandler(async(req, res)   =>{
    const { query: {date} } = req;

    const startDate = new Date(date);
    const endDate = new Date(new Date(date).setDate(new Date(date).getDate() + 1));

    const doc = await getPomodorosRankingByTime(startDate, endDate);

    res.json(createResponse(res, doc));
})

exports.getPomodorosRankingByWeek = asyncHandler(async(req, res)   =>{
    const { query: {date} } = req;

    const startDate = getWeekFirstDay(new Date(date));
    const endDate = getWeekLastDay(new Date(date));

    const doc = await getPomodorosRankingByTime(startDate, endDate);

    res.json(createResponse(res, doc));
})

exports.getPomodorosRankingByMonth = asyncHandler(async(req, res)   =>{
    const { query: {date} } = req;

    const startDate = new Date(new Date(date).setDate(1));
    const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1));

    const doc = await getPomodorosRankingByTime(startDate, endDate);

    res.json(createResponse(res, doc));
})

exports.getPomodorosByUser = asyncHandler(async(req, res)   =>{
    const { user } = req;

    const doc = await Pomodoro.find({writer: user});
    res.json(createResponse(res, doc));
})

exports.getPomodoros = asyncHandler(async(req, res) => {
    const { pomodoroId } = req.params;

    const doc = await Pomodoro.find({_id : pomodoroId});
    res.json(createResponse(res, doc));
})

exports.getPomodoro = asyncHandler(async(req, res)  => {
    const doc = await Pomodoro.find({});

    res.json(createResponse(res, doc));
})
