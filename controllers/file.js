const asyncHandler = require('express-async-handler');
const { parse } = require('url');
const { join, basename } = require('path');
const { ROOT_DIR, UPLOAD_DIR, HOST } = require('../configs');
const { createResponse } = require('../util/response');
const { removeFileByUrl: _removeFileByUrl, removeFileById: _removeFileById } = require('../util/file');
const createError = require('http-errors');
const File = require('../models/file')

const uploadMiddleware = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        throw createError(400, "file not found");
    }

    req.file = await File.create({
        url: `${HOST}/${UPLOAD_DIR}/${req.file.filename}`,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploader: req.user._id
    });
    next();
});


const download = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
        throw createError(400, "file not found");
    }
    const filePath = join(ROOT_DIR, UPLOAD_DIR, basename(parse(file.url).pathname));
    res.download(filePath, file.filename);
});


const uploadFile = asyncHandler(async (req, res, next) => {
    const { file: data } = req;
    const { url } = data;

    res.json({ uploaded: true, url, error: null, data });
});


const removeFileByUrl = asyncHandler(async (req, res, next) => {
    const { url } = req.query;

    await _removeFileByUrl(req.user, url);
    res.json(createResponse(res));
});


const removeFileById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    await _removeFileById(req.user, id);
    res.json(createResponse(res));
});


exports.download = download;
exports.uploadMiddleware = uploadMiddleware;
exports.upload = uploadFile;
exports.removeFileByUrl = removeFileByUrl;
exports.removeFileById = removeFileById;

