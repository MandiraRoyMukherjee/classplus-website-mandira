const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const educationSchema = new mongoose.Schema({
  qualification: { type: String, required: true },
  institute: { type: String, required: true },
  board: { type: String, required: true },
  score: { type: String, required: true },
  outOfScore: { type: String, required: true },
  description: { type: String, maxlength: 280 },
  experience: { type: Number, required: true },
  personalAchievments: { type: Array },
  designation: { type: String, required: true },
});
module.exports = mongoose.model("Education", educationSchema);
