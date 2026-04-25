const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getMySales, updateOrderStatus, hideOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/selling', protect, getMySales);
router.put('/:id/status', protect, updateOrderStatus);
router.patch('/:id/hide', protect, hideOrder);

module.exports = router;
