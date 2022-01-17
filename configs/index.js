exports.PORT = process.env.PORT || 3000;
exports.dbSecretFields = ["__v","password"];
exports.DATABASE_CONNECTION_STRINGS = process.env.MONGO_URL;
exports.IS_PRODUCTION = process.env.NODE_ENV || "production";
exports.SESSION_SECRET = process.env.SESSION_KEY;
exports.KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
exports.KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
exports.KAKAO_REROUTING = process.env.KAKAO_REROUTING_URL;
