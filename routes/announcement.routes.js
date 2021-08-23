const express = require('express');
const router = express.Router();
const {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementsByBranchIdForAdmin,
    getAnnouncementsForAStudentFromAllBranches,
    getAnnouncementsByBranchIdForStudent,
    
} = require('../controllers/announcement.controllers');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBranch } = require('../controllers/test.controllers');

router.post('/announcement/createAnnouncement', createAnnouncement);
router.get('/announcement/getAllAnnouncements', getAllAnnouncements);
router.get('/announcement/getAnnouncementsByBranchIdForAdmin/:id', getAnnouncementsByBranchIdForAdmin);
router.get('/announcement/getAnnouncementsByBranchIdForStudent/:id', getAnnouncementsByBranchIdForStudent);
router.get('/announcement/getAnnouncementsForAStudentFromAllBranches/', getAnnouncementsForAStudentFromAllBranches);

module.exports = router;
