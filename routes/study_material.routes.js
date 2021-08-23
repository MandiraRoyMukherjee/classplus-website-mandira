const express = require('express');
const router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
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
    createStudyMaterial,
    getAllStudyMaterials,
    getStudyMaterialsByBranchId,
    deletestudyMaterial,
    getPDFbystudyMaterialId,
    getStudyMaterialsForAStudentFromAllBranches
} = require('../controllers/study_material.controllers');


router.post('/studyMaterial/createStudyMaterial/:branchId', upload.single('file'),  createStudyMaterial);
router.get('/studyMaterial/getAllStudyMaterials', getAllStudyMaterials);
router.get('/studyMaterial/getStudyMaterialsByBranchId/:id', getStudyMaterialsByBranchId);
router.get('/studyMaterial/getStudyMaterialsForAStudentFromAllBranches/:id', getStudyMaterialsForAStudentFromAllBranches);
router.delete('/studyMaterial/deletestudyMaterial', deletestudyMaterial);

router.get('/studyMaterial/getPDFbystudyMaterialId/:id', getPDFbystudyMaterialId);
module.exports = router;
