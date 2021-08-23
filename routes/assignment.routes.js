const express = require('express');
const router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploadAssignments/' })
// const uploads = require('uploads')
    // const storage = multer.diskStorage({
    //     destination: function(req, file, cb) {
    //         cb(null, 'uploads/');
    //     },

    //     // By default, multer removes file extensions so let's add them back
    //     filename: function(req, file, cb) {
    //         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //     }
    // });
    // var upload = multer({storage: storage});

const {
    createAssignment,
    getAllAssignments,
    getAssignmentsByBranchId,
    getPDFbyAssignmentId,
    deleteAssignment,
    getAssignmentsForAStudentFromAllBranches
} = require('../controllers/assignment.controllers');


router.post('/assignment/createAssignment/:branchId', upload.single('file'),  createAssignment);
router.get('/assignment/getAllAssignments', getAllAssignments);
router.delete('/assignment/deleteAssignment', deleteAssignment);
router.get('/assignment/getAssignmentsByBranchId/:id', getAssignmentsByBranchId);

router.get('/assignment/getPDFbyAssignmentId/:id', getPDFbyAssignmentId);

router.get('/assignment/getAssignmentsForAStudentFromAllBranches/:id', getAssignmentsForAStudentFromAllBranches);

module.exports = router;
