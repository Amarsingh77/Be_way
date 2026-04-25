const Listing = require('../models/Listing');

const checkNgoTransfers = async () => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const expiredListings = await Listing.find({
      type: 'donate',
      status: 'active',
      createdAt: { $lt: fiveDaysAgo }
    });

    if (expiredListings.length === 0) return;

    console.log(`[Cron] Found ${expiredListings.length} NGO items older than 5 days. Transferring to Consumer Buy section...`);

    for (const listing of expiredListings) {
      const basePrice = listing.aiSuggestedPrice || 1000;
      const minimalPrice = Math.max(99, Math.round(basePrice * 0.10)); // 10% or min 99

      listing.type = 'sell';
      listing.price = minimalPrice;
      // Mark it subtly so user knows it was transferred
      listing.description = `[Transferred from NGO Donation Pool] ` + listing.description;
      
      await listing.save();
      console.log(`[Cron] Transferred Listing ${listing._id} to Sell (Price: ₹${minimalPrice})`);
    }
  } catch (error) {
    console.error('[Cron] Error running NGO Transfer Job:', error.message);
  }
};

const startCron = () => {
  // Check immediately on startup
  checkNgoTransfers();

  // Then check every 12 hours (12 * 60 * 60 * 1000 ms)
  setInterval(checkNgoTransfers, 12 * 60 * 60 * 1000);
};

module.exports = { startCron };
