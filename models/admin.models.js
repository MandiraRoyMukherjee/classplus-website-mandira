const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Education = require("./education_details.models").schema;
const Address = require("./address.models").schema;

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 12,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 16,
      trim: true,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      trim: true,
    },
    knownLanguages: {
      type: Array,
      required: true,
      trim: true,
    },
    educationDetails: [Education],
    address: [Address],
    isActive: {
      type: Boolean,
      trim: true,
      default: false,
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Admin", adminSchema);
