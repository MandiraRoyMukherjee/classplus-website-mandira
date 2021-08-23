const express = require('express');
const router = express.Router();
const {
    createQuestion,
    getAllQuestions,
    editQuestion,
    deleteQuestion,
    getQuestionsByTestId,
    getKeyAnswersByTestId
} = require('../controllers/question.controllers');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBranch } = require('../controllers/test.controllers');

router.post('/question/createQuestion', createQuestion);
router.get('/question/getAllQuestions', getAllQuestions);
router.get('/question/getQuestionsByTestId/:id', getQuestionsByTestId);
router.get('/question/getKeyAnswersByTestId/:id', getKeyAnswersByTestId);
router.delete('/question/deleteQuestion/:id', deleteQuestion);
router.put('/question/editQuestion/:id', editQuestion);


module.exports = router;
