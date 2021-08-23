const study_materialSchema = require('../models/study_material.models');
const new_branch = require('../models/new_branch.models');
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const expressJwt =require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
var path = require('path');
var fs = require('fs');
var tj = require('templatesjs');

exports.createStudyMaterial = (req, res) => {
    var obj = {
        pdfName : req.files.file.name,
        pdfSize : req.files.file.size,
        branchId:req.params.branchId,
        study_material: req.files.file
    }
    study_materialSchema.create(obj, (err, item) => {
        if (err) {
            return res.status(401).json({
                status:false,
                error: errorHandler(err)
            });
        }
        else {
            res.status(200).json({
                status:true,
                message: 'study_material is created successfuly.!',
                study_materialData:item
            });
        }
    });
}

exports.getAllStudyMaterials = (req, res) => {
    study_materialSchema.find({},{branchId:1,study_material:1}, {sort: {createdAt: -1}},(err, study_materials) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'All stdy_materials.!',
            study_materialData:study_materials
        });
    });
}

exports.getStudyMaterialsByBranchId = (req, res) => {
    study_materialSchema.find({branchId:req.params.id},{branchId:1,pdfName:1,pdfSize:1}, {sort: {createdAt: -1}},(err, study_material) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                message: 'stdy_material details.!',
                study_materialData: study_material,
                count:study_material.length
            });
        }
    });
}

exports.getStudyMaterialsForAStudentFromAllBranches = (req, res) => {
    new_branch.find({ students: { $all: [req.params.id] }},{students:0},function(err, branchData) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            var idArray = branchData.map(function (el) { return el._id; });
            study_materialSchema.find({"branchId" : { "$in" : idArray}},{"branchId": 1,"study_material": 1}, {sort: {createdAt: -1}},(err, study_material) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }else{
                    return res.json({
                        status:true,
                        message: 'study_material details.!',
                        branchData:idArray,
                        study_materialData: study_material,
                        count:study_material.length
                    });
                }
            });
        }
    });
    
}

exports.getPDFbystudyMaterialId = (req, res) => {
    study_materialSchema.find({_id:req.params.id},(err, result) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                message: 'result details.!',
                study_material: result,
            });
        }
    });
}


exports.deletestudyMaterial = (req, res) => {
    study_materialSchema.deleteMany({},(err, result) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                message: 'result deleted.!',
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

   