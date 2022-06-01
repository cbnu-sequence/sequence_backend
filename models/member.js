const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    team: {
        type: String,
        enum: ['Project', 'TechCourse', null],
        default: null
    },
    githubUrl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    projectUrl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
},{
    timestamps: true
});

const model = mongoose.model('Member', schema);

module.exports = model;
