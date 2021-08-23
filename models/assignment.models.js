const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const assignmentSchema = new mongoose.Schema(
    {
        branchId: {
            type: String,
            ref: 'new_branch',
            required: true
        },
        assignmentUrl:{
            type: String,
        },
        pdfName:{
            type: String,
        },
        pdfSize:{
            type: String,
        },
        assignment: {
            type: Object,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('assignment', assignmentSchema);
