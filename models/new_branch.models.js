const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Admin = require('./admin.models').schema;
const new_branchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    code: {
      type: String,
      // unique: true,
      index: true,
    },
    // desc: {
    //     type: String
    // },
    _class: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    students: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    // pendingStudents: [
    //   {
    //     type: ObjectId,
    //     ref: "User",
    //   },
    // ],
    postedBy:Admin
  },
  { timestamps: true }
);

module.exports = mongoose.model("new_branch", new_branchSchema);
