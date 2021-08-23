const express = require('express');
const router = express.Router();
const {
    createTest,
    getAllTests,
    editTest,
    getTestById,
    deleteBranchesFromTest,
    deleteStudentsFromTest,
    addStudentsToTest,
    getStudentAnsweresforATest,
    addBranchesToTest,
    getTestRankByTestId,
    getAllTestsForAStudent,
    deleteTest
} = require('../controllers/test.controllers');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBranch } = require('../controllers/test.controllers');

router.post('/test/createTest', createTest);
router.get('/test/getAllTests', getAllTests);
router.get('/test/getAllTestsForAStudent/:id', getAllTestsForAStudent);
router.get('/test/getTestById/:id', getTestById);
router.get('/test/getTestRankByTestId/:id', getTestRankByTestId);
router.get('/test/getStudentAnsweresforATest/:testId/:userId', getStudentAnsweresforATest);
router.delete('/test/deleteTest/:id', deleteTest);
router.put('/test/deleteStudentsFromTest/:id', deleteStudentsFromTest);
router.put('/test/deleteBranchesFromTest/:id', deleteBranchesFromTest);
router.put('/test/addStudentsToTest/:id', addStudentsToTest);
router.put('/test/addBranchesToTest/:id', addBranchesToTest);
router.put('/test/editTest/:id', editTest);


module.exports = router;
