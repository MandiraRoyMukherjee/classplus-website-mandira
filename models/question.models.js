const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const questionSchema = new mongoose.Schema(
    {
        testId: {
            type: ObjectId,
            ref: 'test',
            required: true
        },
        question: {
            type: String,
            required: true
        },
        questionType: {
            type: String,
            required: true
        },
        optionA:{
            type: String,
        },
        optionB:{
            type: String,
        },
        optionC:{
            type: String,
        },
        optionD:{
            type: String,
        },
        answer:{
            type: String,
            required: true
        },
        description:{
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('question', questionSchema);
