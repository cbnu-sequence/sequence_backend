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

const schema = new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
      sparse: true,
    },
    comments :[ commentSchema ],
 },{
    timestamps: true
 });
 
 const model = mongoose.model('Post', schema);

 module.exports = model;