const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  isCharity: { type: Boolean, default: false },
  charityName: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
  },
  notes: { type: String, default: '' },
  deliveredAt: Date,
  hiddenByBuyer: { type: Boolean, default: false },
  hiddenBySeller: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
