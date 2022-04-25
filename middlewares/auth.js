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
