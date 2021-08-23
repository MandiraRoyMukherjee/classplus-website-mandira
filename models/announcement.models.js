const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const announcementSchema = new mongoose.Schema(
    {
        branchId: {
            type: String,
            ref: 'new_branch',
            required: true
        },
        admin_announcement : {
            type: Boolean,
            required: true
        },
        student_announcement: {
            type: Boolean,
            required: true
        },
        announcement: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('announcement', announcementSchema);
