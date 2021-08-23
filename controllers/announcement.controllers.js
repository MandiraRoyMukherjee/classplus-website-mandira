const announcementSchema = require('../models/announcement.models');
const testSchema = require('../models/test.models');
const new_branch = require('../models/new_branch.models');
const jwt = require('jsonwebtoken');
const expressJwt =require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

var fs = require('fs');
var bodyParser = require('body-parser');

exports.createAnnouncement = (req, res) => {
    announcementSchema.create(req.body, function(err, result) {
    if (err){
        return res.status(401).json({
            status:false,
            error: errorHandler(err)
        });
    }else{
        res.status(200).json({
            status:true,
            message: 'announcement is created successfuly.!',
            announcementData:result
        });
    }
    });
}

exports.getAllAnnouncements = (req, res) => {
    announcementSchema.find({},{"branchId": 1,"admin_announcement": 1,"student_announcement": 1,"announcement": 1,"createdAt": 1},{sort: {createdAt: -1}},(err, announcements) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'All announcements.!',
            announcementData:announcements
        });
    });
}

exports.getAnnouncementsByBranchIdForAdmin = (req, res) => {
    announcementSchema.find({branchId:req.params.id,admin_announcement:true},{"branchId": 1,"admin_announcement": 1,"student_announcement": 1,"announcement": 1,"createdAt": 1}, {sort: {createdAt: -1}},(err, announcement) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                status:true,
                message: 'announcement details.!',
                announcementData: announcement,
                count:announcement.length
            });
        }
    });
    
}

exports.getAnnouncementsByBranchIdForStudent = (req, res) => {
    announcementSchema.find({branchId:req.params.id,student_announcement:true},{"branchId": 1,"admin_announcement": 1,"student_announcement": 1,"announcement": 1,"createdAt": 1}, {sort: {createdAt: -1}},(err, announcement) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                status:true,
                message: 'announcement details.!',
                announcementData: announcement,
                count:announcement.length
            });
        }
    });
    
}

exports.getAnnouncementsForAStudentFromAllBranches = (req, res) => {
  
    new_branch.find({ students: { $all: [req.query.id] }},{students:0},function(err, branchData) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            var idArray = branchData.map(function (el) { return el._id; });

            announcementSchema.find({"branchId" : { "$in" : idArray},student_announcement:true},{"branchId": 1,"admin_announcement": 1,"student_announcement": 1,"announcement": 1,"createdAt": 1}, {sort: {createdAt: -1}},(err, announcement) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }else{
                    return res.json({
                        status:true,
                        message: 'announcement details.!',
                        branchData:idArray,
                        announcementData: announcement,
                        count:announcement.length
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

   