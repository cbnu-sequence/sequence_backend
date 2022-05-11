const bcrypt = require('bcrypt');
const User = require('../models/user');
const Token = require('../models/Token');
const registerValidator = require("../validators/register");
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
   if(validationResult !== true) throw createError(400, "유효한 입력이 아닙니다.");

   const emailDuple = await User.findOne({email:body.email});
   if(emailDuple) throw createError(400,"현재 이메일을 사용할 수 없습니다.");
   const phoneNumberDuple = await User.findOne({phoneNumber:body.phoneNumber});
   if(phoneNumberDuple) throw createError(400,"현재 전화번호를 사용할 수 없습니다.");
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
   await sendMail(user.email,"이메일 인증 메일입니다.", token);
   res.json(createResponse(res, user, 'User Registered'));
});

exports.resendMail = asyncHandler(async (req, res) => {
   const {user} = req;
   if(user.valid == 1) {
      throw createError(400, "현재 이메일은 인증이 되어있습니다.");
   }
   await Token.findOneAndDelete({email: user.email});
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
      email: user.email,
      ttl: 600 // ttl 값 설정 (10분)
   };
   console.log(token);
   await Token.create({key: data.token, email: data.email, ttl: data.ttl});
   await sendMail(user.email,"이메일 인증 메일입니다.", token);
   res.json(createResponse(res));
})

exports.changeValidEmail = asyncHandler(async (req, res) => {
   const {token} = req.body;
   if(!token) {
      throw createError(400,"토큰을 찾을 수 없습니다.");
   }
   // token 값으로 찾기
   const data = await Token.findOne({key: token});
   if(!data) {
      throw createError(400,"현재 토큰으로 인증할 수 없습니다.")
   }
   if(new Date() > data.createdAt.setSeconds(data.ttl)) {
      await Token.deleteOne({data});
      throw createError(400,"현재 토큰의 유효기간이 지났습니다.")
   }

   // 이메일을 사용 가능하도록 변경
   await User.findOneAndUpdate({email: data.email}, {$set: {valid: 1}});
   await Token.deleteOne({_id: data._id});
   res.json(createResponse(res,'','Change validate Email'));
})

exports.login = asyncHandler(async(req,res) => {
   const {body} = req;
   const exUser = await User.findOne({email:body.email});
   if(!exUser) throw createError(400,"이메일 또는 비밀번호를 찾을 수 없습니다.");
   const isPasswordCorrect = await bcrypt.compare(body.password, exUser.password);
   if(isPasswordCorrect){
      req.session.userId = exUser.id;
      req.session.save();
      res.json(createResponse(res, {userId : exUser._id}));
   } else throw createError(403, "이메일 또는 비밀번호를 찾을 수 없습니다.");
})

exports.getme = asyncHandler(async(req,res) => {
   const { user } = req;
   const data = await User.findOne(user).populate("posts");
   res.json(createResponse(res, data));
})

exports.logout = asyncHandler( async(req,res) => {

   if(req.session.userId){
      req.session.destroy(function(err){
         if(err) throw createError(400, "로그아웃 할 수 없습니다.");
      });
   } else {
      throw createError(400, "로그인되어 있지 않습니다.");
   }
   res.json(createResponse(res,'',"User Logged Out!"));
});

exports.kakaoLogin = asyncHandler(async(req,res)=>{
   const { code, accessToken } = req.query;
   if(!code && !accessToken) throw createError(400, "엑세스 토큰 또는 코드를 찾을 수 없습니다.");
   let token;
   if(!accessToken) {
      token = await axios({//token
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
      }).catch(err => console.log(err))
      if(!token) {
         throw createError(400, '토큰이 존재하지 않습니다.');
      }
   }
   const user = await axios({
      method:'get',
      url:'https://kapi.kakao.com/v2/user/me',
      headers:{
         Authorization: `Bearer ${accessToken? accessToken : token.data.access_token}`
      },
      params: {
         property_keys:["properties.nickname","kakao_account.email"]
      }
   }).catch(err => console.log(err))
   if(!user) {
      throw createError(400, "토큰으로 유저를 찾을 수 없습니다.")
   }
   const userId = user.data.id;
   const userEmail = user.data.kakao_account.email + ":kakao";
   const userName = user.data.properties.nickname;
   const password = await bcrypt.hash(Math.random().toString(36).substr(2,11), 12)
   const exUser = await User.findOne({code:userId});
   if(exUser)
   {
      req.session.userId = exUser.id
      req.session.save()
      res.json(createResponse(res, '', "User Logged In"));
   }
   else if(!exUser)
   {
      const newUser = await User.create({
         code:userId,
         email:userEmail,
         name:userName,
         password: password,
         valid: true
      });
      req.session.userId = newUser.id
      req.session.save()
      res.json(createResponse(res, '', 'User Registered And Logged In'));
   }
})

exports.changeUser = asyncHandler( async(req,res) => {
   const { email } = req.params;
   if(!email) {
      throw createError(400, "변경하려는 이메일이 존재하지 않습니다.")
   }
   await User.findOneAndUpdate({email}, req.body);
   res.json(createResponse(res,'',"modified"));
});
