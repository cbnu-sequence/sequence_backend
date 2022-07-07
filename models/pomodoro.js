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
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true
    },
    sequence: {
        type: Number,
        default: 0,
    },
 },{
    timestamps: true
});

const model = mongoose.model('Pomodoro', schema);

 module.exports = model;
