const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/user');
const registerValidator = require("../validators/register");
const {dbSecretFields} = require('../configs');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const { hashSync } = require("bcrypt");

exports.register = asyncHandler(async(req, res) => {
   const { body } = req
   const validationResult = registerValidator(body);
   if(validationResult !== true) throw createError(400, "Validation Failed");
   const emailDuple = await User.findOne({email:body.email});
   if(emailDuple) throw createError(400,"Email Already In Use");
   const hashedPassword = await bcrypt.hash(body.password, 12);
   const user = await User.create({...body, password: hashedPassword});
   req.session.userId = user.id
   res.json({status: 201, success: true, message: 'User Registered', user: _.omit(user.toObject(), dbSecretFields)});
});

exports.login = asyncHandler(async(req,res) => {
   const {body} = req;
   const exUser = await User.findOne({email:body.email});
   if(!exUser) throw createError(400,"User Not Found");
   const isPasswordCorrect = await bcrypt.compare(body.password, exUser.password);
   if(isPasswordCorrect){
      req.session.userId = exUser.id
      res.json({status: 201, success: true, message: 'User Logged In!'});
   } else throw createError(403, "Password Not Matched!");
})

exports.getme = asyncHandler(async(req,res) => {
   const { user } = req;
   if(!user) throw createError(404, "User Info Not Found");
   res.json({status: 201, success:true, data:user});
})

exports.logout = asyncHandler( async(req,res) => {
   req.session.destroy();
   res.json({status:201, success:true, message:"User Logged Out!"});
})

