const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const userData = { name, email, password };
    if (role === 'ngo') {
      userData.role = 'ngo';
      if (req.file) {
        userData.ngoProofDocument = `/uploads/${req.file.filename}`;
      } else {
        return res.status(400).json({ message: 'NGO Proof Document is required for NGOs' });
      }
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    if (user.isBanned) return res.status(403).json({ message: 'Account banned' });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// @PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, address, relocationMode } = req.body;
    const update = { name, bio, phone, address, relocationMode };
    if (req.file) update.avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/auth/password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/save/:listingId
exports.saveListing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.savedListings.indexOf(req.params.listingId);
    if (idx === -1) user.savedListings.push(req.params.listingId);
    else user.savedListings.splice(idx, 1);
    await user.save();
    res.json({ saved: user.savedListings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
