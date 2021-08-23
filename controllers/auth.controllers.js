const User = require("../models/user.models");
const Admin = require("../models/admin.models");

// const Student = require('../models/student.models');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");
const axios = require("axios");

var fs = require("fs");
var tj = require("templatesjs");
var bodyParser = require("body-parser");

exports.signup = (req, res) => {
  req.body.username = `profile-${req.body.email}`;
  req.body._class = req.body.class;
  User.create(req.body, function (err, userResult) {
    if (err) {
      return res.status(401).json({
        status: false,
        error: errorHandler(err),
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Signup success! Please signin",
        userData: userResult,
      });
    }
    // db.close();
  });
};
exports.signupAdmin = (req, res) => {
  req.body.username = `profile-${req.body.email}`;
  console.log(req.body);
  let { username, name, email, gender, password, dateOfBirth, knownLanguages } = req.body;
  let { qualification, institute, board, score, outOfScore, description, experience, personalAchievments, designation } = req.body;
  let { houseNumber, street, city, zipCode, state, country } = req.body;
  let newUser = {
    username,
    name,
    email,
    password,
    gender,
    dateOfBirth,
    knownLanguages,
    educationDetails: {
      qualification,
      institute,
      board,
      score,
      outOfScore,
      description,
      experience,
      personalAchievments,
      designation,
    },
    address: {
      houseNumber,
      street,
      city,
      zipCode,
      state,
      country,
    },
  };
  // console.log(newUser);

  Admin.create(newUser, function (err, userResult) {
    if (err) {
      console.log("some error occured");
      console.log(err);
      return res.status(401).json({
        status: false,
        error: errorHandler(err),
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Signup success! Please signin",
        userData: userResult,
      });
    }
  });
};

exports.getAllSignups = (req, res) => {
  User.find({}, { isActive: 1, _id: 1, name: 1, email: 1, password: 1, username: 1, testIds: 1, createdAt: 1, updatedAt: 1 }, { sort: { createdAt: -1 } }, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: errorHandler(err),
      });
    }
    return res.json({
      message: "Signup success! Please signin",
      userData: user,
    });
  });
};

exports.getStudentsById = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: errorHandler(err),
      });
    }
    return res.json({
      message: "Signup success! Please signin",
      userData: user,
    });
  });
};

exports.editTestsOfStudent = (req, res) => {
  User.updateOne({ _id: req.params.id }, { $push: { testIds: { $each: req.body.testIds } } }, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: errorHandler(err),
      });
    }
    return res.json({
      message: "user edited successfully.!",
      userData: user,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: false,
        error: "User with that email does not exist. Please signup.",
      });
    }
    // authenticate
    if (user.password !== password) {
      return res.status(400).json({
        status: false,
        error: "Email and password do not match.",
      });
    }
    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const { _id, username, name, email, parentPhoneNo, _class } = user;
    return res.json({
      status: true,
      token,
      user: { _id, username, name, email, parentPhoneNo, _class },
    });
  });
};
exports.signinAdmin = (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  Admin.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: false,
        error: "User with that email does not exist. Please signup.",
      });
    }
    // authenticate
    if (user.password !== password) {
      return res.status(400).json({
        status: false,
        error: "Email and password do not match.",
      });
    }
    // generate a token and send to client
    const tokenAdmin = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const { _id, username, name, email, parentPhoneNo, _class } = user;
    return res.json({
      status: true,
      tokenAdmin,
      user: { _id, username, name, email, parentPhoneNo, _class },
    });
  });
};
exports.modifyStudent = (req, res) => {
  console.log(req.body);
  const _id = req.body.studentId;
  delete req.body._id;
  const newdata = req.body;
  User.findById(_id).exec((err, user) => {
    if (err) {
      console.log(err);
    }
    user.update(newdata, (err, user) => {
      if (err) {
        console.log(err);
      }
      return res.json({
        status: true,
        message: "user updated successfully",
        user: user,
      });
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
exports.signoutAdmin = (req, res) => {
  res.clearCookie("tokenAdmin");
  res.redirect("/admin_login");
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // req.user
});
exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
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
        error: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profile = user;
    next();
  });
};

exports.canUpdateDeleteBranch = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Branch.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    let authorizedUser = user.role !== 1;
    if (!authorizedUser) {
      return res.status(400).json({
        error: "You are not authorized",
      });
    }
    next();
  });
};
