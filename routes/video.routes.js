const express = require('express');
const router = express.Router();
const {
    createVideoLink,
    getAllVideoLinks,
    getVideoLinksByBranchId,
    getVideosForAStudentFromAllBranches
} = require('../controllers/video.controllers');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBranch } = require('../controllers/test.controllers');

router.post('/video/createVideoLink', createVideoLink);
router.get('/video/getAllVideoLinks', getAllVideoLinks);
router.get('/video/getVideoLinksByBranchId/:id', getVideoLinksByBranchId);
router.get('/video/getVideosForAStudentFromAllBranches/:id', getVideosForAStudentFromAllBranches);

module.exports = router;
