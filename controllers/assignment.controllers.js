const assignmentSchema = require('../models/assignment.models');
const new_branch = require('../models/new_branch.models');
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const expressJwt =require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
var path = require('path');
var fs = require('fs');
var tj = require('templatesjs');
var bodyParser = require('body-parser');

exports.createAssignment = (req, res) => {
  
    var obj = {
        branchId:req.params.branchId,
        assignment: req.files.file,
        pdfName : req.files.file.name,
        pdfSize : req.files.file.size,
        assignmentUrl: path.join(__dirname, '../uploadAssignments/'+req.files.file.name)
    }
    assignmentSchema.create(obj, (err, item) => {
        if (err) {
            return res.status(401).json({
                status:false,
                error: errorHandler(err)
            });
        }
        else {
            res.status(200).json({
                status:true,
                message: 'assignment is created successfuly.!',
                assignmentData:item
            });
        }
    });
}

exports.getAllAssignments = (req, res) => {
    
    assignmentSchema.find({},{branchId:1,assignment:1}, {sort: {createdAt: -1}},(err, assignments) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'All assignments.!',
            assignmentData:assignments
        });
    });
}
// const PDFDocument = require('pdfkit');
const { PDFDocument } = require('pdf-lib');

exports.getAssignmentsByBranchId = (req, res) => {
    assignmentSchema.find({branchId:req.params.id},{branchId:1,assignmentUrl:1,pdfName:1,pdfSize:1}, {sort: {createdAt: -1}},(err, assignment) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                message: 'assignment details.!',
                assignmentData: assignment,
                count:assignment.length
            });
        }
    });
}

exports.getPDFbyAssignmentId = (req, res) => {
    assignmentSchema.find({_id:req.params.id},(err, assignment) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                message: 'assignment details.!',
                assignmentData: assignment,
            });
        }
    });
}

exports.getAssignmentsForAStudentFromAllBranches = (req, res) => {
    new_branch.find({ students: { $all: [req.params.id] }},{students:0},function(err, branchData) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            var idArray = branchData.map(function (el) { return el._id; });
            assignmentSchema.find({"branchId" : { "$in" : idArray}},{"branchId": 1,"assignment": 1}, {sort: {createdAt: -1}},(err, assignment) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }else{
                    return res.json({
                        status:true,
                        message: 'assignment details.!',
                        branchData:idArray,
                        assignmentData: assignment,
                        count:assignment.length
                    });
                }
            });
        }
    });
    
}

exports.deleteAssignment = (req, res) => {
    assignmentSchema.deleteMany({},(err, assignment) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                message: 'assignment deleted.!',
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

   