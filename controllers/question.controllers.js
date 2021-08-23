const questionSchema = require('../models/question.models');
const testSchema = require('../models/test.models');

const jwt = require('jsonwebtoken');
const expressJwt =require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

var fs = require('fs');
var tj = require('templatesjs');
var bodyParser = require('body-parser');

exports.createQuestion = (req, res) => {
    console.log(req.body)
    req.body.answer = req.body.answer.trim().toLowerCase().split(/\s/).join('');
    questionSchema.create(req.body, function(err, result) {
    if (err){
        return res.status(401).json({
            status:false,
            // error: errorHandler(err)
        });
    }else{
        res.status(200).json({
            status:true,
            message: 'question is created successfuly.!',
            questionData:result
        });
    }
    });
}

exports.getAllQuestions = (req, res) => {
    questionSchema.find({},{testId: 1, question:1,questionType:1,optionA:1,optionB:1,optionC:1,optionD:1,answer:1,description:1}, {sort: {createdAt: -1}},(err, questions) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'All questions.!',
            questionData:questions
        });
    });
}

exports.getQuestionsByTestId = (req, res) => {

    questionSchema.find({testId:req.params.id},{_id:1,testId: 1, question:1,questionType:1,optionA:1,optionB:1,optionC:1,optionD:1,answer:1,description:1}, {sort: {createdAt: -1}},(err, question) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            testSchema.find({_id:req.params.id},{students: 0, studentsName:0,branches:0,branchesName:0}, {sort: {createdAt: -1}},(err, test) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }
                return res.json({
                    message: 'question details.!',
                    questionData: question,
                    count:question.length,
                    testDetails:test
                });
            });
        }
    });
    
}

exports.getKeyAnswersByTestId = (req, res) => {

    questionSchema.find({testId:req.params.id},{_id:1,answer:1}, {sort: {createdAt: -1}},(err, answers) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'answers details.!',
            answersData: answers,
            count:answers.length
        });
    });
}

exports.deleteQuestion = (req, res) => {

    questionSchema.deleteOne({ _id : req.params.id },(err, question) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'question deleted successfully.!',
            questionData: question
        });
    });
}
    
exports.editQuestion = (req, res) => {
    questionSchema.updateOne({_id : req.params.id},{$set: req.body},(err, question) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'question edited successfully.!',
            questionData: question
        });
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

   