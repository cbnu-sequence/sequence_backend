const { promises, existsSync } = require('fs');
const { sync } = require('mkdirp');
const multer = require('multer');
const { join, extname, basename } = require('path');
const { parse } = require('url');
const { v4 } = require('uuid');
const { ROOT_DIR, UPLOAD_DIR } = require('../configs');
const createError = require('http-errors')
const File = require('../models/file')

const getBasename = url => basename(parse(url).pathname);

const createUpload = (uploadDir = UPLOAD_DIR) => {

    const dir = join(ROOT_DIR, uploadDir);
    if (!existsSync(dir)) sync(dir);

    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, dir);
        },
        filename(req, file, cb) {
            cb(null, `${v4()}${extname(file.originalname)}`);
        }
    });
    return multer({ storage });
};

const removeFileByUrl = async (user, url, baseDir = UPLOAD_DIR) => {
    if (!user) {
        throw createError(403, "No authentication");
    }
    if (!url) return;
    const file = await File.findOne({ url });

    if (!file) return;
    if (String(user._id) !== String(file.uploader)) {
        throw createError(403, "No authentication");
    }

    const filePath = join(ROOT_DIR, '/', baseDir, '/', getBasename(url));

    await Promise.all([file.deleteOne(), promises.unlink(filePath)]);

    return filePath
};

const removeFileById = async (user, id, baseDir = UPLOAD_DIR) => {
    if (!user) {
        throw createError(403, "No authentication");
    }

    if (!id) return;
    const file = await File.findById(id);
    if (!file) return;

    if (String(user._id) !== String(file.uploader)) {
        throw createError(403, "No authentication");
    }
    const filePath = join(ROOT_DIR, '/', baseDir, '/', getBasename(file.url));
    await Promise.all([file.deleteOne(), promises.unlink(filePath)]);
    return filePath;
};

const removeFilesByUrls = async (user, urls, baseDir = UPLOAD_DIR) => await Promise.all(urls.map(url => removeFileByUrl(user, url, baseDir)));

const removeFilesByIds = async (user, ids, baseDir = UPLOAD_DIR) => await Promise.all(ids.map(id => removeFileById(user, id, baseDir)));

const updateFilesByUrls = async (user, ref, refModel, urls) => {
    const files = await File.find({ ref, refModel }) | [];

    if (files.some(file => String(user._id) !== String(file.uploader))) {
        throw createError(403, "No authentication");
    }

    const inDB = files.map(file => file.url);
    const additions = urls.filter(v => !inDB.includes(v));

    if (additions.length > 0) await File.updateMany({ url: { $in: additions } }, { $set: { ref, refModel } });

};

const updateFilesByIds = async (user, ref, refModel, ids) => {
    const files = await File.find({ ref, refModel }) || [];
    if (files.some(file => String(user._id) !== String(file.uploader))) {
        throw createError(403, "No authentication");
    }

    ids = ids.map(id => String(id));
    const inDB = files.map(file => String(file._id));
    const additions = ids.filter(v => !inDB.includes(v));

    if (additions.length > 0) await File.updateMany({ _id: { $in: additions } }, { $set: { ref, refModel } });

};

exports.getBasename = getBasename;
exports.createUpload = createUpload;
exports.removeFileByUrl = removeFileByUrl;
exports.removeFileById = removeFileById;
exports.removeFilesByUrls = removeFilesByUrls;
exports.removeFilesByIds = removeFilesByIds;
exports.updateFilesByUrls = updateFilesByUrls;
exports.updateFilesByIds = updateFilesByIds;
