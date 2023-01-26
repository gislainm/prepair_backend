"use strict";
/*eslint-disable */
require('dotenv').config()
const User = require('../models/user');
const responseInfo = require('../models/responseInfo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let SECRET = process.env.PRIVATE_KEY;

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const Password = req.body.Password;
    try{
        const user = await User.findOne({ email });
        if (user) {
            const validPwd = await bcrypt.compare(Password, user.Password);
            if (validPwd) {
                const accessToken = jwt.sign({
                    id: user._id,
                    email: user.email,
                    iat: Date.now()
                }, SECRET);
                res.status(200).json(new responseInfo(false, null, {
                    accessToken,
                    user
                }))
            } else {
                res.status(400).json(new responseInfo(true, 'Wrong password', null))
            }
        } else {
            res.status(400).json(new responseInfo(true, 'User not found', null))
        }
    }catch(error){
        console.log(error);
    }
}
exports.signup = async (req, res, next) => {
    const newuser = new User(req.body);
    try {
        await newuser.save()
        res.status(201).json(new responseInfo(false, null, newuser));
    } catch (error) {
        console.log(error)
        res.status(500).json(new responseInfo(true, "signing up user failed", null));
    }
}

exports.updateUserInfo = async (req, res, next) => {
    const email = req.body.email;
    const newUserInfo = req.body.Updates;
    if(newUserInfo.hasOwnProperty('Gender')){
        newUserInfo.Image = newUserInfo.Gender === "Male"?"user1.png":"FemaleUser.png";
    }
    try{
        await User.updateOne({ email }, newUserInfo);
        const updatedUser = await User.findOne({ email });
        res.status(200).json(new responseInfo(false, null, updatedUser ));
    }catch(error){
        res.status(400).json(new responseInfo(true, "Updating user information failed", null))
    }
}

exports.updateUserPwd = async(req,res,next)=>{
    const email = req.body.email;
    const oldPwd = req.body.oldPwd;
    const newPwd = req.body.newPwd;
    try {
        const user = await User.findOne({email});
        const validOldPwd = await bcrypt.compare(oldPwd,user.Password);
        if(validOldPwd){
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPwd, salt);
            await User.updateOne({email},{Password:hashPassword});
            const updatedUser = await User.findOne({ email });
            res.status(200).json(new responseInfo(false, null, updatedUser ));
        }else{
            res.status(400).json(new responseInfo(true, "Wrong Old Password", null))
        }
    } catch (error) {
        res.status(400).json(new responseInfo(true, "Wrong Old Password", null))
    }
}

exports.getMentors = async (req, res, next) => {
    const discipline = req.params.discipline;
    try {
        const mentors = await User.find({ Role: 'Mentor', Discipline: discipline });
        res.status(200).json(new responseInfo(false, null, mentors));
    } catch (error) {
        res.status(400).json(new responseInfo(true, "searching mentors failed", null));
    }
}

// exports.authenticate = (req, res, next) => {
//     const [, token] = req.headers.authorization.split(" ");
//     try {
//         let permission = jwt.verify(token, SECRET);
//         res.status(200).json(new responseInfo(false, null, permission));
//     } catch (err) {
//         res.status(400).json(new responseInfo(true, "Invalid JWT", null));
//     }
// }

// exports.fetchProfile = async (req, res, next) => {
//     const email = req.params.email;
//     try {
//         const userInfo = await User.findOne({ email });
//         res.status(200).json(new responseInfo(false, null, userInfo));
//     } catch (error) {
//         res.status(400).json(new responseInfo(true, "profile fetch failed", null));
//     }
// }

// exports.completeUserInfo = async (req, res, next) => {
//     const email = req.body.email;
//     const newUserInfo = req.body.moreInfo
//     if (newUserInfo.Gender === "Male") {
//         newUserInfo.Image = "user1.png";
//     } else if (newUserInfo.Gender === "Female") {
//         newUserInfo.Image = "FemaleUser.png";
//     }
//     try {
//         const updateUser = await User.updateOne({ email }, newUserInfo);
//         const updatedUser = await User.findOne({ email });
//         const accessToken = jwt.sign({
//             id: updatedUser._id,
//             email: updatedUser.email,
//             iat: Date.now()
//         }, SECRET);
//         res.status(200).json(new responseInfo(false, null, { accessToken, updatedUser }));
//     } catch (error) {
//         res.status(400).json(new responseInfo(true, "completing user's information failed", null))
//     }
// }


exports.getAllUser = async(req,res,next)=>{
    try {
         const usersInfo = await User.find();
        res.status(200).json(new responseInfo(false, null, usersInfo));
    } catch (error) {
        console.log(error)
        res.status(400).json(new responseInfo(true, "profile fetch failed", null));
    }
}