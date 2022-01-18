const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   code: {
      type: Number,
      unique: true,
      default: null,
      sparse: true,
   },
   email: {
      type: String,
      unique: true,
   },
   password: {
      type: String,
   },
   name: {
      type: String,
   },
   role : {
      type: String,
      enum: ['Admin', 'User','Member'], // Added Role : Member
      default: 'User'
   }
},{
   timestamps: true
});

const model = mongoose.model('user', schema);

module.exports = model;
