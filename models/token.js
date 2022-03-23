const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String,
    },
    ttl: {
        type: Number,
    },
    key: {
        type:String,
    },
},{
    timestamps: true
});

const model = mongoose.model('Token', schema);

module.exports = model;
