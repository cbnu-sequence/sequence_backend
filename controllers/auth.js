const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/user');
const registerValidator = require("../validators/register");
const {dbSecretFields} = require('../configs');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const qs = require('qs');
const axios = require("axios")
const nodemailer = require("nodemailer")
const {
   KAKAO_REROUTING,
   KAKAO_CLIENT_ID,
   KAKAO_CLIENT_SECRET,
    MAIL_SERVICE,
    MAIL_USER,
    MAIL_PASS,
    MAIL_FROM,
    MAIL_HOST
} = require('../configs')


exports.register = asyncHandler(async(req, res) => {
   const { body } = req;

   const validationResult = registerValidator(body);
   if(validationResult !== true) throw createError(400, "Validation Failed");

   const emailDuple = await User.findOne({email:body.email});
   if(emailDuple) throw createError(400,"Email Already In Use");
   const telDuple = await User.findOne({tel:body.tel});
   if(telDuple) throw createError(400,"Tel Already In Use");
   const nicknameDuple = await User.findOne({nickname:body.nickname});
   if(nicknameDuple) throw createError(400,"Nickname Already In Use");

   const hashedPassword = await bcrypt.hash(body.password, 12);

   const user = await User.create({...body, password: hashedPassword, code:null});
   try {
      const mailConfig = {
         service: MAIL_SERVICE,
         host: MAIL_HOST,
         port: 587,
         auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
         }
      }
      const message = {
         from: MAIL_FROM,
         to: body.email,
         subject: "이메일 인증 메일입니다.",
         html: '<a href="http://localhost:3000/auth/valid?authUrl=' + body.email+ '"><p> 이메일을 인증하시려면 여기를 클릭하세요 </p></a>'
      }
      const transporter = nodemailer.createTransport(mailConfig)
      transporter.sendMail(message)
   } catch (error) {
      throw createError(400,"Mail does not send")
   }
   res.json({status: 201, success: true, message: 'User Registered', user: _.omit(user.toObject(), dbSecretFields)});
});

exports.changeValidEmail = asyncHandler(async (req, res) => {
   const {authUrl} = req.query;
   console.log(authUrl);
   await User.findOneAndUpdate({email: authUrl}, {$set: {valid: 1}});
   res.json({status: 201, success: true, message: 'Change validate Email'});
})

exports.login = asyncHandler(async(req,res) => {
   const {body} = req;
   const exUser = await User.findOne({email:body.email, valid: 1});
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
});

exports.kakaoLogin = asyncHandler(async(req,res)=>{
   const {body} = req
   const accessCode = body.accessCode;
   if(!accessCode) throw createError(400, "No Access Code Found")
   const token = await axios({//token
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers:{
         'content-type':'application/x-www-form-urlencoded'
      },
      data:qs.stringify({
         grant_type: 'authorization_code',
         client_id:KAKAO_CLIENT_ID,
         client_secret:KAKAO_CLIENT_SECRET,
         redirectUri:KAKAO_REROUTING,
         code:accessCode,
      })
   })

   const user = await axios({
      method:'get',
      url:'https://kapi.kakao.com/v2/user/me',
      headers:{
         Authorization: `Bearer ${token.data.access_token}`
      },
      params: {
         property_keys:["properties.nickname","kakao_account.email"]
      }
   })

   const userId = user.data.id;
   const userEmail = user.data.kakao_account.email;
   const userName = user.data.properties.nickname;
   const password = await bcrypt.hash(Math.random().toString(36).substr(2,11), 12)
   const exUser = await User.findOne({code:userId});
   if(exUser)
   {
      req.session.userId = exUser.id
      res.json({success: true, status: 200, message:"User Logged In"});
   }
   if(!exUser)
   {
      const newUser = await User.create({
         code:userId,
         email:userEmail,
         name:userName,
         password: password
      });
      req.session.userId = newUser.id
      res.json({success: true, status: 200, message:"User Registered And Logged In"});
   }
})

