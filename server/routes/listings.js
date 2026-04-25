const express = require('express');
const router = express.Router();
const { getListings, getListing, createListing, updateListing, deleteListing, getMyListings, getRecommended, hideListing, seedDB } = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/seed', seedDB);
router.get('/', getListings);
router.get('/my', protect, getMyListings);
router.patch('/:id/hide', protect, hideListing);
router.get('/recommended/:id', getRecommended);
router.get('/:id', getListing);
router.post('/', protect, upload.array('images', 5), createListing);
router.put('/:id', protect, upload.array('images', 5), updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
