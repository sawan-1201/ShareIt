const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({  //blueprint if the data 
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true }, // user unique id for each file
    sender: { type: String, required: false }, //if link will get then no need of sender if we sent on email then its required
    receiver: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema); // generate model name 0f file