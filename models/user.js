const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   code: {
      type: Number,
      default: null
   },
   email: {
      type: String,
      unique: true,
      required: true,
   },
   password: {
      type: String,
      sparse: true,
      required: true,
   },
   name: {
      type: String,
      trim: true,
      required: true,
   },
   tel: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
   },
   nickname: {
      type: String,
      unique: true,
      trim: true,
      required: true,
   },
   role : {
      type: String,
      enum: ['Admin', 'User','Member'], // Added Role : Member
      default: 'User'
   },
   valid: {
      type: Boolean,
      default: 0,
   },
   posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    }]
},{
   timestamps: true
});

const model = mongoose.model('User', schema);

module.exports = model;
