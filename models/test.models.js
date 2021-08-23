const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const testSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        },
        points: {
            type: Number,
            index: true
        },
        total_questions:{
            type: Number,
            required: true
        },
        duration:{
            type: Number,
            required: true
        },
        duration:{
            type: Number,
            required: true
        },
        students: [{ 
            type: ObjectId,
            ref: 'User'
        }],
        branches: [{ 
            type: ObjectId,
            ref: 'Branch'
        }],
         studentsName: [{ 
            type: String
        }],
        branchesName: [{ 
            type: String
        }],
        faculty:{
            type: String,
            default: 'Admin',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('test', testSchema);
