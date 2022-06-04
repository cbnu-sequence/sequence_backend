const asyncHandler = require("express-async-handler");

exports.pagingList = asyncHandler(async(req,res,next) => {

    req.page = (req.query.page || 1);
    req.limit = (req.query.limit || 10);
    req.sort = req.query.sort || undefined;
    req.skip = req.limit * ((isNaN(req.page) ? 1 : req.page) - 1);
    return next();
})
