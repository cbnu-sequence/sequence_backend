const mongoose = require('mongoose');
const { POST_CATEGORY } = require('../constants')

const schema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
    },
    category1: {
      type: String,
      enum: Object.keys(POST_CATEGORY),
      required: true,
    },
    category2: {
        type: String,
    },
    content: {
      type: String,
      required: true,
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      sparse: true,
    },
    files: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "File",
    }],
    images: [{
       type: mongoose.Schema.Types.ObjectId,
        ref: "File",
    }]
 },{
    timestamps: true
 });

const model = mongoose.model('Post', schema);

 module.exports = model;
