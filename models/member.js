const mongoose = require('mongoose');
const {TEAMS} = require("../constants");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    team: {
        type: String,
        enum: TEAMS,
        default: null
    },
    githubUrl: {
        type: String,
        default: null,
    },
    otherUrls: [{
        type: String,
        default: null,
    }],
    comment: {
        type: String,
        default: null,
    },
    part: {
        type: String,
        default: null,
    }
},{
    timestamps: true
});

const model = mongoose.model('Member', schema);

module.exports = model;
