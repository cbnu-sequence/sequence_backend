const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
   contents:{
      type: String, 
      required:true},
   writer:{
      type: String, 
      required:true},
},{
      timestamps: true
});

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
    comments :[ commentSchema ],
 },{
    timestamps: true
 });
 