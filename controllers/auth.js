const bcrypt = require('bcrypt');
const _ = require('lodash');
const Post = require('../models/post');
const User = require('../models/user');
const Token = require('../models/Token');
const registerValidator = require("../validators/register");
const {dbSecretFields} = require('../configs');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const {sendMail} = require('../util/mail');
const {createResponse} = require('../util/response')
const qs = require('qs');
const axios = require("axios")
const {
   KAKAO_REROUTING,
   KAKAO_CLIENT_ID,
   KAKAO_CLIENT_SECRET
} = require('../configs')


exports.register = asyncHandler(async(req, res) => {
   const { body } = req;

   const validationResult = registerValidator(body);
   if(validationResult !== true) throw createError(400, "Validation Failed");

   const emailDuple = await User.findOne({email:body.email});
   if(emailDuple) throw createError(400,"Email Already In Use");
   const phoneNumberDuple = await User.findOne({phoneNumber:body.phoneNumber});
   if(phoneNumberDuple) throw createError(400,"PhoneNumber Already In Use");
   const hashedPassword = await bcrypt.hash(body.password, 12);

   const user = await User.create({...body, password: hashedPassword, code:null});

   // 토큰 생성
   let token;
   while (true) {
      token = ''
      for (let i = 0; i < 6; i++) {
         token += String(Math.floor(Math.random() * 10))
      }
      const val = await Token.findOne({key: token})
      if(!val) {
         break
      }
   }
   const data = {
      token,
      email: body.email,
      ttl: 600 // ttl 값 설정 (10분)
   };
   await Token.create({key: data.token, email: data.email, ttl: data.ttl});

   // 메일 전송
   await sendMail(body.email,"이메일 인증 메일입니다.", '<p> 이메일 인증 번호는 '+ token + '입니다 </p>');
   res.json(createResponse(res, user, 'User Registered'));
});

exports.changeValidEmail = asyncHandler(async (req, res) => {
   const {token} = req.body;
   if(!token) {
      throw createError(400,"Token not found.");
   }
   // token 값으로 찾기
   const data = await Token.findOne({key: token});
   if(!data) {
      throw createError(400,"Email does not changed.")
   }
   if(new Date() > data.createdAt.setSeconds(data.ttl)) {
      await Token.deleteOne({data});
      throw createError(400,"The validity period has expired.")
   }

   // 이메일을 사용 가능하도록 변경
   await User.findOneAndUpdate({email: data.email}, {$set: {valid: 1}});
   await Token.deleteOne({_id: data._id});
   res.json(createResponse(res,'','Change validate Email'));
})

exports.login = asyncHandler(async(req,res) => {
   const {body} = req;
   const exUser = await User.findOne({email:body.email});

   // 이메일 인증이 필요하면 로그인 x
   if(exUser.valid == 0) throw createError(400, "Email verification required")

   if(!exUser) throw createError(400,"User Not Found");
   const isPasswordCorrect = await bcrypt.compare(body.password, exUser.password);
   if(isPasswordCorrect){
      req.session.userId = exUser.id;
      req.session.save();
      res.json(createResponse(res, {userId : exUser._id}));
   } else throw createError(403, "Password Not Matched!");
})

exports.getme = asyncHandler(async(req,res) => {
   const { user } = req;
   const data = await User.findOne(user).populate("posts");
   res.json(createResponse(res, data));
})

exports.logout = asyncHandler( async(req,res) => {

   if(req.session.userId){
      req.session.destroy(function(err){
         if(err) throw createError(400, "logout error");
      });
   } else {
      throw createError(400, "You are not logged in");
   }
   res.json(createResponse(res,'',"User Logged Out!"));
});

exports.kakaoLogin = asyncHandler(async(req,res)=>{
   const {code} = req.query
   if(!code) throw createError(400, "No Access Code Found")
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
         code,
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
   const userEmail = user.data.kakao_account.email + ":kakao";
   const userName = user.data.properties.nickname;
   const password = await bcrypt.hash(Math.random().toString(36).substr(2,11), 12)
   const exUser = await User.findOne({code:userId});
   if(exUser)
   {
      req.session.userId = exUser.id
      req.session.save()
      res.json(createResponse(res, data, "User Logged In"));
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
      req.session.save()
      res.json(createResponse(res, '', 'User Registered And Logged In'));
   }
})