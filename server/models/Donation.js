const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientType: { type: String, enum: ['user', 'ngo'], default: 'user' },
  ngoName: { type: String, default: '' },
  status: {
    type: String,
    enum: ['available', 'claimed', 'delivered', 'cancelled'],
    default: 'available',
  },
  message: { type: String, default: '' },
  claimedAt: { type: Date },
  deliveredAt: { type: Date },
  hiddenByDonor: { type: Boolean, default: false },
  hiddenByRecipient: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
