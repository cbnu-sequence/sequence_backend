const Token = require("../models/token");
const axios = require("axios");
const {KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_REROUTING} = require("../configs");
const createError = require("http-errors");
exports.createToken = async () => {
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
    return token;
}

exports.getKakaoToken = async () => {

    const token = await axios({
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

    return token;
}

exports.getUserByKakaoToken = async (accessToken, token) => {
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

    return user;
}
