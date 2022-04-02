const mongoose = require('mongoose');
const {FILE_TYPES} = require('../constants');

const schema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
        sparse: true,
    },
    filename: String,
    mimetype: String,
    size: Number,
    ref: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'refModel',
        default: null,
    },
    refModel: {
        type: String,
        enum: [...FILE_TYPES, null],
        default: null,
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    }
}, {
    createdAt: 'uploadedAt',
    updatedAt: false
});

const model = mongoose.model('File', schema);

module.exports = model;