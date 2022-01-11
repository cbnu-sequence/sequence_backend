const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
},{
   timestamps: true
});

const model = mongoose.model('user', schema);

module.exports = model;
