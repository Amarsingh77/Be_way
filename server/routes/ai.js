// Rule-based AI price prediction endpoint
const express = require('express');
const router = express.Router();

const basePrices = {
  tops: 300, bottoms: 500, dresses: 600, outerwear: 1200,
  footwear: 800, accessories: 200, ethnic: 900, sportswear: 400,
  kids: 200, other: 300,
};
const conditionMultipliers = {
  new: 0.9, like_new: 0.7, good: 0.5, fair: 0.3, poor: 0.15,
};
const premiumBrands = ['nike', 'adidas', 'zara', 'h&m', 'levis', 'puma', 'gucci', 'louis vuitton', 'forever21', 'mango', 'uniqlo'];
const IMPACT = {
  tops: { co2: 2.1, water: 2700 }, bottoms: { co2: 3.0, water: 3800 },
  dresses: { co2: 3.5, water: 4000 }, outerwear: { co2: 5.0, water: 5000 },
  footwear: { co2: 2.5, water: 2000 }, accessories: { co2: 0.5, water: 500 },
  ethnic: { co2: 4.0, water: 4500 }, sportswear: { co2: 2.0, water: 2500 },
  kids: { co2: 1.5, water: 1500 }, other: { co2: 2.0, water: 2000 },
};

// @POST /api/ai/price
router.post('/price', (req, res) => {
  const { category, condition, brand } = req.body;
  const safeCategory = (category || '').toLowerCase();
  const base = basePrices[safeCategory] || 300;
  const cond = conditionMultipliers[condition] || 0.5;
  const brandMult = brand && premiumBrands.includes(brand.toLowerCase()) ? 1.5 : 1.0;
  const price = Math.round(base * cond * brandMult);
  const min = Math.round(price * 0.8);
  const max = Math.round(price * 1.2);
  res.json({ suggested: price, range: { min, max }, confidence: 82 });
});

// @POST /api/ai/impact
router.post('/impact', (req, res) => {
  const { items } = req.body; // array of {category}
  let co2 = 0, water = 0;
  (items || []).forEach(item => {
    const imp = IMPACT[item.category] || IMPACT.other;
    co2 += imp.co2;
    water += imp.water;
  });
  res.json({ co2Saved: co2, waterSaved: water, itemsDiverted: items.length });
});

// @GET /api/ai/categories
router.get('/categories', (req, res) => {
  res.json(Object.keys(basePrices));
});

// @POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "I await your inquiry." });

    const query = message.toLowerCase();
    
    // Simulate slight processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    let reply = "That is a beautiful inquiry. At BeWay, our philosophy is anchored in circularity and empowerment. Whether you choose to circulate your wardrobe through our Market or our Donation Spirit, you are extending the lifecycle of luxury and fulfilling the dreams of those who inherit them. How may I guide your journey today?";

    if (query.match(/website|beway|mission|what is this|unique/)) {
      reply = "BeWay is an exclusive circular luxury ecosystem. We believe fashion should be a continual narrative, not a disposable commodity. Our platform allows consciousness to meet aesthetic refinement, ensuring that every garment's history is honored and extended.";
    } else if (query.match(/donate|donation|give|charity/)) {
      reply = "Donation on BeWay transcends simple charity. It is the act of passing the baton of inspiration. By donating a piece you no longer wear, you empower individuals, wrapping them not just in fabric, but in dignity, confidence, and a renewed sense of potential.";
    } else if (query.match(/sell|market|selling|price/)) {
      reply = "Selling your curated pieces isn't merely transactional—it's an elevation of sustainable commerce. It extends the lifecycle of exceptional garments, mitigates environmental exhaust, and unlocks value for your next conscious acquisition, all while maintaining the integrity of luxury.";
    } else if (query.match(/dream|fulfill|others|impact/)) {
      reply = "Every garment holds the echo of a dream. When you pass on a beautifully tailored jacket or an elegant dress, you are offering someone else the confidence to walk into an interview or the grace to attend a celebration. You are actively fulfilling the dreams of others through the artistry of your wardrobe.";
    }

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "Forgive me, my archives are temporarily resting." });
  }
});

module.exports = router;
