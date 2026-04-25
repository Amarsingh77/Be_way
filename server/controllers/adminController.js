const User = require('../models/User');
const Listing = require('../models/Listing');
const Donation = require('../models/Donation');
const Order = require('../models/Order');

// @GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [users, listings, donations, orders] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Donation.countDocuments(),
      Order.countDocuments(),
    ]);
    const [activeListings, pendingListings, totalRevenue] = await Promise.all([
      Listing.countDocuments({ status: 'active' }),
      Listing.countDocuments({ status: 'pending' }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    // Monthly data for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyListings = await Listing.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
    ]);

    res.json({
      total: { users, listings, donations, orders },
      active: activeListings,
      pending: pendingListings,
      revenue: totalRevenue[0]?.total || 0,
      monthlyListings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
    const users = await User.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { role, isBanned } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role, isBanned }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/listings
exports.getListings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const listings = await Listing.find(filter).populate('seller', 'name email').sort('-createdAt').skip((page - 1) * limit).limit(Number(limit));
    const total = await Listing.countDocuments(filter);
    res.json({ listings, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/listings/:id/status
exports.moderateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });

    const IMPACT = {
      tops: { co2: 2.1, water: 2700 }, bottoms: { co2: 3.0, water: 3800 },
      dresses: { co2: 3.5, water: 4000 }, outerwear: { co2: 5.0, water: 5000 },
      footwear: { co2: 2.5, water: 2000 }, accessories: { co2: 0.5, water: 500 },
      ethnic: { co2: 4.0, water: 4500 }, sportswear: { co2: 2.0, water: 2500 },
      kids: { co2: 1.5, water: 1500 }, other: { co2: 2.0, water: 2000 },
    };
    
    // Reverse user impact
    const impact = IMPACT[(listing.category || '').toLowerCase()] || IMPACT.other;
    await User.findByIdAndUpdate(listing.seller, {
      $inc: {
        'impact.itemsListed': -1,
        'impact.co2Saved': -impact.co2,
        'impact.waterSaved': -impact.water,
        ...(listing.type === 'donate' ? { 'impact.itemsDonated': -1 } : {}),
      }
    });

    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('listing').populate('donor', 'name email').populate('recipient', 'name').sort('-createdAt').limit(50);
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted permanently' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/listings/:id
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/donations/:id/status
exports.updateDonation = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('buyer', 'name email').populate({ path: 'items.listing', select: 'title price' }).sort('-createdAt').limit(50);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/orders/:id/status
exports.updateOrder = async (req, res) => {
  try {
    const { shippingStatus, paymentStatus } = req.body;
    const updateTokens = {};
    if (shippingStatus) updateTokens.shippingStatus = shippingStatus;
    if (paymentStatus) updateTokens.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateTokens, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/donations/:id
exports.deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
