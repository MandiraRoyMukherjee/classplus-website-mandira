const User = require("../models/user.models");
const Branch = require("../models/branch.models");
const formidable = require("formidable");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.read = (req, res) => {
  User.findById(req.query.id, (err, user) => {
      console.log(user)
      if(user && !err) {
          return res.status(200).json(req.profile);
      }
      else{
          return res.status(404).json({msg: "User not found"});
      }
  });
};
