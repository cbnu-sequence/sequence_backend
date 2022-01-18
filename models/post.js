const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
       type: String,
       required: true,
       unique: true
    },
    contents: {
       type: String,
       required: true,
    },
    writer: {
       type: String,
       required: true,
    },
    comments : {
       contents: String,
       writer: String,
       commentsID: ObjectId,
    }
 },{
    timestamps: true
 });
 