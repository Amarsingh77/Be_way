const Donation = require('../models/Donation');
const Listing = require('../models/Listing');
const User = require('../models/User');

// @POST /api/donations
exports.createDonation = async (req, res) => {
  try {
    const listing = await Listing.findById(req.body.listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.type !== 'donate') return res.status(400).json({ message: 'Listing is not a donation' });

    const donation = await Donation.create({
      listing: listing._id,
      donor: req.user._id,
      ...req.body,
    });
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/donations
exports.getDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 12 } = req.query;
    const filter = status ? { status } : {};
    const donations = await Donation.find(filter)
      .populate('listing').populate('donor', 'name avatar').populate('recipient', 'name avatar')
      .sort('-createdAt').skip((page - 1) * limit).limit(Number(limit));
    const total = await Donation.countDocuments(filter);
    res.json({ donations, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/donations/:id/claim
exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Not found' });
    if (donation.status !== 'available') return res.status(400).json({ message: 'Already claimed' });

    donation.recipient = req.user._id;
    donation.status = 'claimed';
    donation.claimedAt = new Date();
    await donation.save();

    await Listing.findByIdAndUpdate(donation.listing, { status: 'donated' });
    await User.findByIdAndUpdate(donation.donor, { $inc: { 'impact.itemsDonated': 1 } });

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/donations/my
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ 
      $or: [
        { donor: req.user._id, hiddenByDonor: { $ne: true } },
        { recipient: req.user._id, hiddenByRecipient: { $ne: true } }
      ]
    }).populate('listing').populate('recipient', 'name');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PATCH /api/donations/:id/hide
exports.hideDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    
    const donorId = donation.donor && (donation.donor._id ? donation.donor._id.toString() : donation.donor.toString());
    const recipientId = donation.recipient && (donation.recipient._id ? donation.recipient._id.toString() : donation.recipient.toString());

    if (donorId === req.user._id.toString()) {
      donation.hiddenByDonor = true;
    } else if (recipientId === req.user._id.toString()) {
      donation.hiddenByRecipient = true;
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await donation.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
