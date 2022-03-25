const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   code: {
      type: Number,
      default: null
   },
   email: {
      type: String,
      unique: true
   },
   password: {
      type: String,
      sparse: true
   },
   name: {
      type: String,
      trim: true
   },
   phoneNumber: {
      type: String,
      unique: true,
      sparse: true
   },
   nickname: {
      type: String,
      unique: true,
      trim: true
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
