const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
       type: String,
       required: true,
    },
    isFinished: {
       type: Boolean,
       default: false,
    },
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
 },{
    timestamps: true
 });

const model = mongoose.model('Pomodoro', schema);

 module.exports = model;
