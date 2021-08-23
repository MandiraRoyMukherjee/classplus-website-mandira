const express = require('express');
const router = express.Router();
// const { requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth.controllers');
const {requireAuth, requireAuthAdmin} = require('../middleware/authMiddleware')
const { read} = require('../controllers/user.controllers');

router.get('/user/profile/', read);

module.exports = router;
