const testSchema = require('../models/test.models');
const branchSchema = require("../models/new_branch.models");
const User = require('../models/user.models');
const questionSchema = require('../models/question.models');
const jwt = require('jsonwebtoken');
const expressJwt =require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var fs = require('fs');
var tj = require('templatesjs');
var bodyParser = require('body-parser');
const { response } = require('express');
const { find } = require('../models/user.models');

exports.createTest = (req, res) => {
    testSchema.create(req.body, function(err, result) {
        if (err){
            return res.status(401).json({
                status:false,
                error: errorHandler(err)
            });
        }else{
            res.status(200).json({
                status:true,
                message: 'test is created successfuly.!',
                testData:result
            });
        }
    });
}

exports.getAllTests = (req, res) => {
    testSchema.find({},{title: 1, points:1,total_questions:1,duration:1,faculty:1,students:1,branches:1,studentsName:1,branchesName:1,createdAt:1,updatedAt:1}, {sort: {createdAt: -1}},(err, tests) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
            return res.json({
                message: 'All tests.!',
                testData:tests
            });
      
    });
}

exports.getAllTestsForAStudent = (req, res) => {
    testSchema.aggregate([
        { $lookup:
            {
               from: "questions",
               localField: "_id",
               foreignField: "testId",
               as: "questions"
            }
        },  
        {
          $project: {
            studentsName:0,
            branchesName:0
          }
        }
    ]).then((response)=>{
        User.find({ _id: req.params.id },(err, user) => {
            if (err) {
                return res.status(401).json({
                    error: errorHandler(err)
                });
            }
            let result = [];
            let doneTest = [];
            let filterResult = [];
            response.forEach((element,i) => {

                element.students.some(function(el) {
                    if(el == req.params.id){
                        result.push(element._id);
                        let obj = user[0].testIds.find(o => o.testIds == element._id);
                        element.doneTest = obj
                        filterResult.push(element)
                    }
                }); 
            });
            res.json({testData:filterResult,testIds:result,user:user})
        });
    }).catch((err)=>{
        console.log('####errorr-->',err)
    })
}

exports.getTestById = (req, res) => {

    testSchema.find({_id:req.params.id},(err, test) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'test details.!',
            testData: test
        });
    });
}

exports.deleteTest = (req, res) => {

    testSchema.deleteOne({ _id : req.params.id },(err, test) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            questionSchema.deleteMany({testId:req.params.id},(err, ques) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }else{
                    return res.json({
                        message: 'test deleted successfully.!',
                        testData: test,
                        quesData: ques
                    });
                }
            })
        }
    });
}
    
exports.editTest = (req, res) => {
    testSchema.updateOne({_id : req.params.id},{$addToSet: req.body},(err, test) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'test edited successfully.!',
            testData: test
        });
    });
}

exports.addStudentsToTest = (req, res) => {
    testSchema.find({_id : req.params.id},{students:1,_id:0}, {sort: {createdAt: -1}},(err, tests) => {
        var array1 = req.body.students.filter(val => !tests[0].students.includes(val));
        testSchema.updateOne({_id : req.params.id},{$push: { students: array1 ,studentsName: req.body.studentsName }},(err, test) => {
            if (err) {
                return res.status(401).json({
                    error: errorHandler(err)
                });
            }
            return res.json({
                message: 'test edited successfully.!',
                testData: test
            });
        });
    })
    
}

exports.addBranchesToTest = (req, res) => {
    if(req.body.branches.length > 0){
        testSchema.findById({_id : req.params.id},{students:1,_id:0},(err, test) => {        
        branchSchema.find({_id: {$in : req.body.branches}},{_id:0,students:1},function(err,branchStds) {
            var result = branchStds.reduce((obj,current)=>{
                (obj['students'] = obj['students']||[]).push(current.students);
                return obj;
            },{});
            var mergeStudents = [].concat.apply([], result.students);
            mergeStudents =  mergeStudents.concat(test.students)
            var mergeStudents = [...new Set([...mergeStudents])]
            User.find({_id: {$in : mergeStudents}},{_id:0,name:1},function(err,branchStds) {
                branchStds = branchStds.map(item => item['name']);
                testSchema.updateOne({_id : req.params.id},{$push: { branches: req.body.branches ,branchesName: req.body.branchesName }, $addToSet: {students : mergeStudents ,studentsName:branchStds}},(err, test) => {
                    if (err) {
                        return res.status(401).json({
                            error: errorHandler(err)
                        });
                    }                
                    return res.json({
                        message: 'test edited successfully.!',
                        testData: test
                    });
                });  
            })
        });
    })
        
    }
}

exports.deleteStudentsFromTest = (req, res) => {
    testSchema.updateOne({_id : req.params.id},{$pull: { students: { $in: req.body.students },studentsName: { $in: req.body.studentsName } }},(err, test) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        return res.json({
            message: 'test edited successfully.!',
            testData: test
        });
    });
}

exports.deleteBranchesFromTest = (req, res) => {
    testSchema.find({_id : req.params.id},(err, test) => {
        testSchema.updateOne({_id : req.params.id},{$pull: { branches: { $in: req.body.branches } ,branchesName: { $in: req.body.branchesName }, students: { $in: test[0].students } ,studentsName: { $in: test[0].studentsName }}},(err, test) => {
            if (err) {
                return res.status(401).json({
                    error: errorHandler(err)
                });
            }
            return res.json({
                message: 'test edited successfully.!',
                testData: test
            });
        });
    })
}

exports.getStudentAnsweresforATest = (req, res) => {
    testSchema.find({$in : req.params.testId},(err, user) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        else{
            return res.json({
                message: 'test edited successfully.!',
                testData: user
            });
        }
    })
}

exports.getTestRankByTestId = (req, res) => {
    User.find({testIds :{"$elemMatch" : { testIds:req.params.id} } },{testIds:1,name:1},(err, studentsObj) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }
        else{
            var result = [];
            var rankNum = studentsObj.length >= 3 ? 3 : studentsObj.length;
            const course = studentsObj.reduce((r, {testIds,name}) => {
                if (testIds && !r) {
                  const course = testIds.find(({testIds}) => testIds == req.params.id);
                    
                    result.push({name:name,score:course.score})
                }
                return r;
              }, null)
            
            const firstThree = (result, n) => {
                if(n > result.length){
                   return false;
                }
                return result
                .slice()
                .sort((a, b) => {
                   return b.score - a.score
                })
                .slice(0, n);
             };
             
              
            return res.json({
                message: 'Top 3 rank fetched successfully.!',
                highestScore: firstThree(result, rankNum)
            });
        }
    })
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

   