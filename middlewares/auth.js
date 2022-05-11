const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const User = require('../models/user')

exports.requiredLogin = asyncHandler(async(req,res,next) => {
   const userId = req.session.userId;
   if(!userId) throw createError(403, "You Are Not Logged In");
   req.user = await User.findById(userId);
   if(!req.user) throw createError(400, "Session is not valid");
   return next();
})

exports.hasRole = asyncHandler(async(req,res,next) => {
   const userId = req.session.userId;
   if(!userId) throw createError(403, "You Are Not Logged In");
   req.user = await User.findById(userId);
   if(req.user.role !== "Admin") throw createError(400, "You do not have permission");
   return next();
})

exports.verifiedUser = asyncHandler(async(req,res,next) => {
   const userId = req.session.userId;
   if(!userId) throw createError(403, "You Are Not Logged In");
   req.user = await User.findById(userId);
   if(!req.user.valid) throw createError(400, "이메일 인증이 필요합니다.");
   return next();
})
