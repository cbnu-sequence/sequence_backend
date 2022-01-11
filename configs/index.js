exports.PORT = process.env.PORT || 3000;
exports.dbSecretFields = ["__v","password"];
exports.DATABASE_CONNECTION_STRINGS = process.env.DATABASE_CONNECTION_STRINGS;
exports.IS_PRODUCTION = process.env.NODE_ENV || "prod"
exports.SESSION_SECRET = process.env.SESSION_SECRET
