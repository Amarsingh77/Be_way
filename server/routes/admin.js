const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUser, deleteUser, getListings, updateListing, moderateListing, deleteListing, getDonations, updateDonation, deleteDonation, getOrders, updateOrder, deleteOrder } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/listings', getListings);
router.put('/listings/:id', updateListing);
router.put('/listings/:id/status', moderateListing);
router.delete('/listings/:id', deleteListing);
router.get('/donations', getDonations);
router.put('/donations/:id/status', updateDonation);
router.delete('/donations/:id', deleteDonation);
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrder);
router.delete('/orders/:id', deleteOrder);

module.exports = router;
