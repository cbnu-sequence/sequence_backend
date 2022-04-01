const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
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
 },{
    timestamps: true
 });

const model = mongoose.model('Post', schema);

 module.exports = model;