const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin', 'ngo'], default: 'user' },
  ngoProofDocument: { type: String, default: '' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  relocationMode: { type: Boolean, default: false },
  impact: {
    itemsListed: { type: Number, default: 0 },
    itemsDonated: { type: Number, default: 0 },
    itemsSold: { type: Number, default: 0 },
    co2Saved: { type: Number, default: 0 },   // kg
    waterSaved: { type: Number, default: 0 },  // litres
  },
  savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
