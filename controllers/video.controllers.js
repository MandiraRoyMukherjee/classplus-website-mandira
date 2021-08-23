const videoSchema = require('../models/video.models');
const new_branch = require('../models/new_branch.models');
const jwt = require('jsonwebtoken');
const expressJwt =require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

var fs = require('fs');
var tj = require('templatesjs');
var bodyParser = require('body-parser');

exports.createVideoLink = (req, res) => {
    videoSchema.create(req.body, function(err, result) {
    if (err){
        return res.status(401).json({
            status:false,
            error: errorHandler(err)
        });
    }else{
        res.status(200).json({
            status:true,
            message: 'video url is created successfuly.!',
            videoData:result
        });
    }
    });
}

exports.getAllVideoLinks = (req, res) => {
    videoSchema.find({},{branchId:1,videoURL:1}, {sort: {createdAt: -1}},(err, videos) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'All videos.!',
            videoData:videos
        });
    });
}

exports.getVideoLinksByBranchId = (req, res) => {
    videoSchema.find({branchId:req.params.id},{branchId:1,videoURL:1}, {sort: {createdAt: -1}},(err, video) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                message: 'video details.!',
                videoData: video,
                count:video.length
            });
        }
    });
}

exports.getVideosForAStudentFromAllBranches = (req, res) => {
    new_branch.find({ students: { $all: [req.params.id] }},{students:0},function(err, branchData) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            var idArray = branchData.map(function (el) { return el._id; });

            videoSchema.find({"branchId" : { "$in" : idArray}},{"branchId": 1,"videoURL": 1}, {sort: {createdAt: -1}},(err, video) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }else{
                    return res.json({
                        status:true,
                        message: 'video details.!',
                        branchData:idArray,
                        videoData: video,
                        count:video.length
                    });
                }
            });
        }
    });
    
}


    exports.requireSignin = expressJwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256']  // req.user
    });
    exports.authMiddleware = (req, res, next) => {
        const authUserId = req.user._id;
        User.findById({ _id: authUserId }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            req.profile = user;
            next();
        });
    };

    exports.adminMiddleware = (req, res, next) => {
        const adminUserId = req.user._id;
        User.findById({ _id: adminUserId }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
    
            if (user.role !== 1) {
                return res.status(400).json({
                    error: 'Admin resource. Access denied'
                });
            }
    
            req.profile = user;
            next();
        });
    };

   