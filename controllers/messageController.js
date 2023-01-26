"use strict";
/*eslint-disable */

const User = require('../models/user');
const Message = require('../models/messages');
const responseInfo = require('../models/responseInfo');
const { ObjectId } = require('mongodb');

exports.sendMessage = async (req, res, next) => {
    const receiver = req.body.receiver;
    const sender = req.body.sender;
    const messageRoom = await Message.findOne({ participants: { $all: [sender, receiver] } });
    try {
        if(messageRoom){
            await Message.updateOne({_id:messageRoom._id},{$push:{messages:req.body}});
            const updatedRoom = await Message.findOne({_id:messageRoom._id}).populate("participants");
            res.status(201).json(new responseInfo(false, null, updatedRoom));
        }else{
            const newMessage = new Message({
                participants:[req.body.receiver,req.body.sender],
                messages:[req.body]
            })
            await newMessage.save()
            const newMessageToReturn = await Message.findOne({_id:newMessage._id}).populate("participants") 
            res.status(201).json(new responseInfo(false, null, newMessageToReturn));
        }
    } catch (error) {
        res.status(500).json(new responseInfo(true, "Sending a new message failed", null));
        console.log(error);
    }
}

exports.getMessages = async(req,res,next)=>{
    const user1 = req.params.user1;
    const user2 = req.params.user2
    try {
        const messageRoom = await Message.findOne({ participants: { $all: [user1, user2] } });
        if(messageRoom){
            res.status(201).json(new responseInfo(false, null, messageRoom));
        }else{
            res.status(201).json(new responseInfo(false, null, {
                participants: [user1,user2],
                messages:[]
        }));
        }
        
    } catch (error) {
        res.status(500).json(new responseInfo(true, "Finding message-room failed", null));
        console.log(error);
    }
}

exports.getCurrentUserRooms = async (req,res,next)=>{
    const currentUser_Id = req.params.user_id;
    try {
        const messageRooms = await Message.find({participants:currentUser_Id}).populate("participants");
        res.status(201).json(new responseInfo(false,null,messageRooms))
    } catch (error) {
        res.status(500).json(new responseInfo(true, "Finding current user message-rooms failed", null));
        console.log(error);
    }
}