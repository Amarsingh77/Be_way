require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');

const CATEGORIES = ['tops', 'bottoms', 'dresses', 'outerwear', 'footwear', 'accessories'];
const CONDITIONS = ['new', 'like_new', 'good', 'fair'];
const TYPES = ['sell', 'donate', 'charity'];
const GENDERS = ['men', 'women', 'unisex'];

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

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Listing.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'BeWay Admin',
      email: 'admin@beway.com',
      password: 'admin123',
      role: 'admin',
      impact: { itemsListed: 15, itemsDonated: 5, itemsSold: 10, co2Saved: 45.2, waterSaved: 52000 },
    });
    console.log('✅ Admin created: admin@beway.com / admin123');

    // Create demo users
    const demoUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya@demo.com',
      password: 'demo123',
      role: 'user',
      impact: { itemsListed: 8, itemsDonated: 3, itemsSold: 5, co2Saved: 24.5, waterSaved: 28000 },
    });

    const demoUser2 = await User.create({
      name: 'Rahul Gupta',
      email: 'rahul@demo.com',
      password: 'demo123',
      role: 'user',
      impact: { itemsListed: 5, itemsDonated: 2, itemsSold: 3, co2Saved: 15.0, waterSaved: 18000 },
    });
    console.log('✅ Demo users created');

    // Create listings
    const sellers = [admin, demoUser, demoUser2];
    for (let i = 0; i < DEMO_LISTINGS.length; i++) {
      const l = DEMO_LISTINGS[i];
      await Listing.create({
        ...l,
        seller: sellers[i % 3]._id,
        aiSuggestedPrice: l.price ? Math.round(l.price * 0.9) : 0,
        aiTags: [l.category, l.brand, l.color, l.gender].filter(Boolean),
        location: ['Mumbai', 'Delhi', 'Bangalore', 'Pune'][i % 4],
        images: l.images || [],
      });
    }
    console.log(`✅ ${DEMO_LISTINGS.length} listings created`);
    console.log('\n🎉 Seed complete! Run: npm run dev');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
