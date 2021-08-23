const User = require("../models/user.models");
const Branch = require("../models/branch.models");
const Admin = require("../models/admin.models");
const new_branch = require("../models/new_branch.models");
const formidable = require("formidable");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendEmail = (req, res) => {
    var mailOptions = {
        from: process.env.EMAIL,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('error----------->',error);
        } else {
            console.log('Email sent: ' + info.response);
            return res.send('Email sent: ')
        }
    });
}


exports.create = (req, res) => {
    const admin_id = req.body.postedBy;
    Admin.findById(admin_id, (err, admin)=>{
        if(!err && admin){
            console.log(admin)
            const {title, code, start_date, _class,students } = req.body;
            const branch = new new_branch({postedBy: admin, title, code, start_date, _class,students });
            branch.save((err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }else{
                    return res.json({
                        status:true,
                        message: 'Branch created successfully.!!',
                        userData:user
                    });
                }
                
            });
        }

       
    })

  
}

exports.list = (req, res) => {
    console.log(req.query.admin)
    // postedBy:req.query.admin
    
    new_branch.find({"postedBy._id":req.query.admin}).sort({createdAt: 'desc'}).find(function(err, user) {
      if (err) {
          return res.status(401).json({
              error: errorHandler(err)
          });
      }
      return res.json({
          status:true,
          message: 'All branches fetched successfully.!',
          userData:user
      });
  }); 
}
exports.getAllBranches = (req, res) => {
  new_branch.find({}).sort({createdAt: 'desc'}).find(function(err, branches) {
      if (err) {
          return res.status(401).json({
              error: errorHandler(err)
          });
      }
      return res.json({
          status:true,
          message: 'All branches fetched successfully.!',
          branches
      });
  }); 
}

exports.branchStudentsByBranchId = (req, res) => {
    new_branch.find({_id:req.params.id},function(err, branchData) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            User.find({_id: { $in: branchData[0].students } },(err, studentslist) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }
                return res.json({
                    message: 'all studentslists',
                    studentslist:studentslist,
                    branchData:branchData
                });
            });
        }
    }); 
}

exports.addStudentsToBranch = (req, res) => {
   const branch_id = mongoose.Types.ObjectId(req.params.id)
    new_branch.find({_id:req.params.id},function(err, branchData) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            new_branch.updateOne({ "_id": req.params.id },{$push: {students: {$each: req.body.students}}},(err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }
                else{
                    const addedUsers  =  req.body.students.map(id => mongoose.Types.ObjectId(id));
                    User.updateMany({"_id":{$in: addedUsers}}, {$pull: {requestedBatches: branch_id}, $push: {enrolledBatches: branch_id}}, function(err, updatedUsers){
                        if(err){
                            return res.status(401).json({
                                error: errorHandler(err)
                            });
                        }
                        return res.json({
                            message: 'updated successfully',
                            result:result
                        });
                    })
               
            }
        });
                
              

        }
    }); 
}
exports.removeStudentsFromBranch  = (req, res) => {
    new_branch.find({_id:req.params.id},function(err, branchData) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            new_branch.updateOne({ "_id": req.params.id },{$pull: { students: { $in: req.body.students}}},(err, result) => {
                if (err) {
                    return res.status(401).json({
                        error: errorHandler(err)
                    });
                }
                return res.json({
                    message: 'updated successfully',
                    result:result
                });
            });
        }
    });
}
exports.branchRequest = (req, res) => {
    User.findById(req.body.student_id,function(err, user) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            new_branch.findById(req.body.branch_id, function(err, branch){  
                let message = "";              
                if(branch && user){
                    if(!user.requestedBatches.some(item=>item._id.toString()===req.body.branch_id) && !user.enrolledBatches.some(item=>item._id.toString()===req.body.branch_id)){
                        user.requestedBatches.push(branch);
                        user.save() 
                        message = "Branch added successfully";
                    }else{
                        message = "Already applied for this branch";
                    }
                    return res.json({
                        message,
                        user,
                        branch
                    });
                }else{
                    console.log(err);
                }
            })
           
        }
    })
}

exports.getPendingRequests = (req, res) => {
    console.log(req.query.branch_id)

    User.find({"requestedBatches":mongoose.Types.ObjectId(req.query.branch_id)}, (err, users) => {
        if (err) {
          return res.status(401).json({
            error: errorHandler(err),
          });
        }
        else{
          return res.json({
            users,
          });
        }
       
      });
   
  };
exports.getAllBranchesForAStudent  = (req, res) => {
    new_branch.find({ students: { $all: [req.params.studentId] }},function(err, branchData) {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            });
        }else{
            return res.json({
                message: 'fetched successfully',
                result:branchData
            });
        }
    });
}
