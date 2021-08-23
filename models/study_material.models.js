const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const study_materialSchema = new mongoose.Schema(
    {
        branchId: {
            type: String,
            ref: 'new_branch',
            required: true
        },
        pdfName:{
            type: String,
        },
        pdfSize:{
            type: String,
        },
        study_material: {
            type: Object,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('study_material', study_materialSchema);
