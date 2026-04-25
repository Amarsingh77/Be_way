const Listing = require('../models/Listing');
const User = require('../models/User');

// CO2 & water saved estimates per item (by category)
const IMPACT = {
  tops: { co2: 2.1, water: 2700 },
  bottoms: { co2: 3.0, water: 3800 },
  dresses: { co2: 3.5, water: 4000 },
  outerwear: { co2: 5.0, water: 5000 },
  footwear: { co2: 2.5, water: 2000 },
  accessories: { co2: 0.5, water: 500 },
  ethnic: { co2: 4.0, water: 4500 },
  sportswear: { co2: 2.0, water: 2500 },
  kids: { co2: 1.5, water: 1500 },
  other: { co2: 2.0, water: 2000 },
};

// @GET /api/listings
exports.getListings = async (req, res) => {
  try {
    const { category, type, condition, gender, minPrice, maxPrice, search, page = 1, limit = 12, sort = '-createdAt', relocation } = req.query;
    const filter = { status: 'active', isHidden: { $ne: true } };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (condition) filter.condition = condition;
    if (gender) filter.gender = gender;
    if (relocation === 'true') filter.isRelocation = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const [listings, total] = await Promise.all([
      Listing.find(filter).populate('seller', 'name avatar').sort(sort).skip((page - 1) * limit).limit(Number(limit)),
      Listing.countDocuments(filter),
    ]);

    res.json({ listings, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/listings/:id
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name avatar bio impact');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    listing.views += 1;
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/listings
exports.createListing = async (req, res) => {
  try {
    const { title, description, price, category, condition, type, charityName, size, brand, color, gender, aiTags, isRelocation, location, usageDuration } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const listing = await Listing.create({
      title, description, price: Number(price) || 0,
      aiSuggestedPrice: calculateAIPrice((category || '').toLowerCase(), condition, brand),
      category: (category || '').toLowerCase(), condition, type, charityName, size, brand, color, gender: (gender || '').toLowerCase(),
      aiTags: aiTags ? JSON.parse(aiTags) : [],
      seller: req.user._id, images, isRelocation, location, usageDuration,
      status: 'active',
    });

    // update user impact
    const impact = IMPACT[(category || '').toLowerCase()] || IMPACT.other;
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'impact.itemsListed': 1,
        'impact.co2Saved': impact.co2,
        'impact.waterSaved': impact.water,
        ...(type === 'donate' ? { 'impact.itemsDonated': 1 } : {}),
      }
    });

    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/listings/:id
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) updates.images = req.files.map(f => `/uploads/${f.filename}`);
    const updated = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
      
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

// @GET /api/listings/my
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id, isHidden: { $ne: true } }).sort('-createdAt');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PATCH /api/listings/:id/hide
exports.hideListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    const sellerId = listing.seller && (listing.seller._id ? listing.seller._id.toString() : listing.seller.toString());
    
    if (!sellerId || sellerId !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden' });
    
    listing.isHidden = true;
    await listing.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Hide listing error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/listings/recommended/:id
exports.getRecommended = async (req, res) => {
  try {
    const src = await Listing.findById(req.params.id);
    if (!src) return res.status(404).json({ message: 'Not found' });
    const recs = await Listing.find({
      _id: { $ne: src._id },
      status: 'active',
      $or: [{ category: src.category }, { gender: src.gender }],
    }).limit(6).populate('seller', 'name avatar');
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rule-based AI price suggestion
function calculateAIPrice(category, condition, brand) {
  const basePrices = {
    tops: 300, bottoms: 500, dresses: 600, outerwear: 1200,
    footwear: 800, accessories: 200, ethnic: 900, sportswear: 400,
    kids: 200, other: 300,
  };
  const conditionMultipliers = {
    new: 0.9, like_new: 0.7, good: 0.5, fair: 0.3, poor: 0.15,
  };
  const premiumBrands = ['nike', 'adidas', 'zara', 'h&m', 'levis', 'puma', 'gucci', 'louis vuitton', 'forever21'];
  const base = basePrices[category] || 300;
  const condMult = conditionMultipliers[condition] || 0.5;
  const brandMult = brand && premiumBrands.includes(brand.toLowerCase()) ? 1.5 : 1.0;
  return Math.round(base * condMult * brandMult);
}

// @GET /api/listings/seed
exports.seedDB = async (req, res) => {
  try {
    const DEMO_LISTINGS = [
      { title: 'Nike Dri-FIT Athletic Tee', category: 'tops', condition: 'like_new', type: 'sell', price: 450, brand: 'Nike', gender: 'men', color: 'Blue', size: 'L', description: 'Barely worn Nike athletic tee in excellent condition. Perfect for workouts.', images: ['/uploads/nike_tee.png'] },
      { title: 'Zara Summer Floral Dress', category: 'dresses', condition: 'good', type: 'sell', price: 800, brand: 'Zara', gender: 'women', color: 'Floral', size: 'M', description: 'Beautiful floral dress from Zara. Worn only twice. Great for summer outings.', images: ['/uploads/zara_dress.png'] },
      { title: 'Levi\'s 511 Slim Jeans', category: 'bottoms', condition: 'good', type: 'sell', price: 1200, brand: 'Levis', gender: 'men', color: 'Blue', size: '32', description: 'Classic Levi\'s jeans in great condition. Comfortable and stylish.', images: ['/uploads/levis_jeans.png'] },
      { title: 'Winter Jacket (Free!)', category: 'outerwear', condition: 'good', type: 'donate', price: 0, brand: 'H&M', gender: 'unisex', color: 'Black', size: 'XL', description: 'Warm winter jacket. Giving away as I no longer need it. Still in great shape!', images: ['/uploads/winter_jacket.png'] },
      { title: 'Ethnic Kurta Set', category: 'ethnic', condition: 'like_new', type: 'charity', price: 600, charityName: 'Smile Foundation', brand: '', gender: 'women', color: 'Red', size: 'S', description: 'Elegant kurta set worn once. Proceeds go to Smile Foundation NGO.', images: ['/uploads/kurta_set.png'] },
      { title: 'Running Shoes Size 10', category: 'footwear', condition: 'good', type: 'sell', price: 900, brand: 'Puma', gender: 'men', color: 'White', size: '10', description: 'Puma running shoes with good cushioning. Sold as relocating.', images: ['/uploads/running_shoes.png'] },
      { title: "Children's School Uniform", category: 'kids', condition: 'good', type: 'donate', price: 0, brand: '', gender: 'kids', color: 'White/Grey', size: '8y', description: 'Complete school uniform set for age 8. Donating as child has outgrown.', images: ['/uploads/school_uniform.png'] },
      { title: 'Designer Leather Belt', category: 'accessories', condition: 'new', type: 'sell', price: 350, brand: '', gender: 'unisex', color: 'Brown', size: 'One Size', description: 'Brand new leather belt, never used. Gift that didn\'t fit.', images: ['/uploads/leather_belt.png'] },
      { title: 'Sabyasachi Heritage Saree', category: 'ethnic', condition: 'like_new', type: 'sell', price: 85000, brand: 'Sabyasachi', gender: 'women', color: 'Maroon', size: 'One Size', description: 'Exquisite bridal heritage saree worn only for a 3-hour photoshoot. Hand-embroidered with vintage zardozi work.', images: ['/uploads/saree.png'], usageDuration: '< 6 Months' },
      { title: 'Patagonia Nano Puff Jacket', category: 'outerwear', condition: 'good', type: 'sell', price: 4500, brand: 'Patagonia', gender: 'unisex', color: 'Olive Green', size: 'M', description: 'Built for the mountains, worn in the city. Excellent condition, incredibly warm but lightweight. Made from recycled materials.', images: ['/uploads/patagonia.png'], usageDuration: '1-2 Years' },
      { title: 'Vintage Burberry Trench Coat', category: 'outerwear', condition: 'fair', type: 'charity', price: 12000, charityName: 'Refugee Relief Fund', brand: 'Burberry', gender: 'men', color: 'Beige', size: 'L', description: 'Authentic 1990s Burberry trench. Shows gentle signs of an adventurous past. Giving away to support a cause.', images: ['/uploads/trench.png'], usageDuration: '2+ Years' },
      { title: 'Gucci Horsebit Loafers', category: 'footwear', condition: 'good', type: 'sell', price: 15000, brand: 'Gucci', gender: 'men', color: 'Black', size: '9', description: 'Classic black leather loafers. Resoled last year and lovingly polished. Timeless style.', images: ['/uploads/loafers.png'], usageDuration: '2+ Years' },
      { title: 'Raw Mango Chanderi Kurta', category: 'ethnic', condition: 'like_new', type: 'donate', price: 0, brand: 'Raw Mango', gender: 'women', color: 'Yellow', size: 'M', description: 'Bright yellow handloom Chanderi kurta. Passing this piece on so someone else can enjoy its vibrant energy.', images: ['/uploads/rawmango.png'], usageDuration: '< 6 Months' },
      { title: 'Ralph Lauren Cashmere Sweater', category: 'tops', condition: 'new', type: 'sell', price: 6500, brand: 'Ralph Lauren', gender: 'unisex', color: 'Navy Blue', size: 'L', description: 'Brand new with tags. 100% pure cashmere. Luxuriously soft, perfect for winter layering.', images: ['/uploads/sweater.png'], usageDuration: 'New' },
      { title: 'Adidas Ultraboost 22', category: 'sportswear', condition: 'good', type: 'sell', price: 4000, brand: 'Adidas', gender: 'women', color: 'White/Grey', size: '7', description: 'Used for occasional jogging. Plenty of bounce left in the sole. Washed and sanitized.', images: ['/uploads/ultraboost.png'], usageDuration: '6-12 Months' },
      { title: 'Vintage Leather Biker Jacket', category: 'outerwear', condition: 'poor', type: 'sell', price: 2000, brand: 'Schott', gender: 'unisex', color: 'Distressed Brown', size: 'M', description: 'Heavy distressed leather with raw character. Requires some TLC but has an unbeatable vintage look.', images: ['/uploads/biker.png'], usageDuration: '2+ Years' },
      { title: 'Baby Gap Winter Onesie', category: 'kids', condition: 'like_new', type: 'donate', price: 0, brand: 'Gap', gender: 'kids', color: 'White', size: '12-18m', description: 'Soft and cozy. Outgrown before it could really be worn. Hope it keeps a little one warm.', images: ['/uploads/onesie.png'], usageDuration: '< 6 Months' },
      { title: 'Lululemon Align Leggings', category: 'sportswear', condition: 'good', type: 'charity', price: 2500, charityName: 'Girls Go Run', brand: 'Lululemon', gender: 'women', color: 'Black', size: 'S', description: 'Buttery soft leggings. No pilling. Proceeds go towards empowering young female athletes.', images: ['/uploads/leggings.png'], usageDuration: '6-12 Months' },
      { title: 'Classic Ray-Ban Wayfarers', category: 'accessories', condition: 'like_new', type: 'sell', price: 3500, brand: 'Ray-Ban', gender: 'unisex', color: 'Tortoiseshell', size: 'Standard', description: 'Classic tortoiseshell Wayfarers. No scratches on lenses. Includes original leather case.', images: ['/uploads/raybans.png'], usageDuration: '6-12 Months' },
    ];
    
    await Listing.deleteMany({});
    
    // Assumes users exist; just get the first one to assign seller
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'BeWay Admin',
        email: 'admin@beway.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    const inserted = [];
    for (let i = 0; i < DEMO_LISTINGS.length; i++) {
      const l = DEMO_LISTINGS[i];
      const newL = await Listing.create({
        ...l,
        seller: adminUser._id,
        aiSuggestedPrice: l.price ? Math.round(l.price * 0.9) : 0,
        aiTags: [l.category, l.brand, l.color, l.gender].filter(Boolean),
        location: ['Mumbai', 'Delhi', 'Bangalore', 'Pune'][i % 4],
        images: l.images || [],
      });
      inserted.push(newL);
    }
    
    res.json({ success: true, count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
