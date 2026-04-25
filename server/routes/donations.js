const express = require('express');
const router = express.Router();
const { createDonation, getDonations, claimDonation, getMyDonations, hideDonation } = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

router.get('/', getDonations);
router.get('/my', protect, getMyDonations);
router.post('/', protect, createDonation);
router.post('/:id/claim', protect, claimDonation);
router.patch('/:id/hide', protect, hideDonation);

module.exports = router;
