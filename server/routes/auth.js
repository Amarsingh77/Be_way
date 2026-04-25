const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, updatePassword, saveListing, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', upload.single('ngoProofDocument'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.delete('/profile', protect, deleteAccount);
router.put('/password', protect, updatePassword);
router.post('/save/:listingId', protect, saveListing);

module.exports = router;
