"use strict";
/*eslint-disable */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
        participants:[{type: Schema.Types.ObjectId, ref: 'User', required: true}],
        messages:[{
        receiver:{type: Schema.Types.ObjectId, ref: 'User', required: true},
        sender:{type: Schema.Types.ObjectId, ref: 'User', required: true},
        messageBody:String,
        timeSent:{type:Date,default:Date.now},
        }]
})
const Model = mongoose.model('Message', messageSchema);
module.exports = Model;