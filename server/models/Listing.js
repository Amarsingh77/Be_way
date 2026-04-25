const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, default: 0 },
  aiSuggestedPrice: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'footwear', 'accessories', 'ethnic', 'sportswear', 'kids', 'other'],
    default: 'other',
  },
  condition: {
    type: String,
    enum: ['new', 'like_new', 'good', 'fair', 'poor'],
    default: 'good',
  },
  type: {
    type: String,
    enum: ['sell', 'donate', 'charity'],
    default: 'sell',
  },
  charityName: { type: String, default: '' },
  size: { type: String, default: '' },
  brand: { type: String, default: '' },
  color: { type: String, default: '' },
  gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
  aiTags: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'active', 'sold', 'donated', 'rejected'],
    default: 'active',
  },
  isRelocation: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  location: { type: String, default: '' },
  usageDuration: { type: String, default: '' },
  isHidden: { type: Boolean, default: false },
}, { timestamps: true });

listingSchema.index({ title: 'text', description: 'text', brand: 'text', aiTags: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
