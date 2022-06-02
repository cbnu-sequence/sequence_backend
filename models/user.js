const mongoose = require('mongoose');
const {ROLES} = require("../constants");

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
   role : {
      type: String,
      enum: ROLES,
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
    }],
   member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
   }
},{
   timestamps: true
});

const model = mongoose.model('User', schema);

module.exports = model;
