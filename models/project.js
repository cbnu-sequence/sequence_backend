const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
    },
    content: {
       type: String,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }],
    tags: [{
        type: String,
    }],
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    images: [{
       type: mongoose.Schema.Types.ObjectId,
        ref: "File",
    }],
    year: {
       type: String,
       required: true,
    },
    githubUrl: {
       type: String,
    },
    projectUrl: {
       type: String,
    }
 },{
    timestamps: true
 });

const model = mongoose.model('Project', schema);

 module.exports = model;
