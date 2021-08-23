const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const videoSchema = new mongoose.Schema(
    {
        branchId: {
            type: String,
            ref: 'new_branch',
            required: true
        },
        videoURL: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('video', videoSchema);
