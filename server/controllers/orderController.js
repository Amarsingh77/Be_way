const Order = require('../models/Order');
const Listing = require('../models/Listing');
const User = require('../models/User');

// @POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { listingId, shippingAddress, notes } = req.body;
    const listing = await Listing.findById(listingId).populate('seller');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'active') return res.status(400).json({ message: 'Listing no longer available' });
    if (listing.seller._id.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot buy your own listing' });

    const order = await Order.create({
      listing: listing._id,
      buyer: req.user._id,
      seller: listing.seller._id,
      amount: listing.price,
      isCharity: listing.type === 'charity',
      charityName: listing.charityName,
      shippingAddress, notes,
    });

    await Listing.findByIdAndUpdate(listingId, { status: 'sold' });
    await User.findByIdAndUpdate(listing.seller._id, { $inc: { 'impact.itemsSold': 1 } });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id, hiddenByBuyer: { $ne: true } })
      .populate({ path: 'listing', populate: { path: 'seller', select: 'name avatar' } })
      .sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/selling
exports.getMySales = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id, hiddenBySeller: { $ne: true } })
      .populate('listing').populate('buyer', 'name avatar email').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    order.status = req.body.status;
    if (req.body.status === 'delivered') order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PATCH /api/orders/:id/hide
exports.hideOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const buyerId = order.buyer && (order.buyer._id ? order.buyer._id.toString() : order.buyer.toString());
    const sellerId = order.seller && (order.seller._id ? order.seller._id.toString() : order.seller.toString());

    if (buyerId === req.user._id.toString()) {
      order.hiddenByBuyer = true;
    } else if (sellerId === req.user._id.toString()) {
      order.hiddenBySeller = true;
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await order.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Hide order error:', err);
    res.status(500).json({ message: err.message });
  }
};
