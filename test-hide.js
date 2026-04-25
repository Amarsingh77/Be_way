const mongoose = require('mongoose');
const Order = require('./server/models/Order');
const Listing = require('./server/models/Listing');
require('dotenv').config({ path: './server/.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beway');
  const orders = await Order.find().limit(1);
  if (!orders.length) {
    console.log("No orders found");
    process.exit(0);
  }
  const order = orders[0];
  console.log("Order fetched:", order);

  try {
     const buyerId = order.buyer && (order.buyer._id ? order.buyer._id.toString() : order.buyer.toString());
     console.log("buyerId:", buyerId);
  } catch (e) {
     console.error("Error evaluating buyerId:", e);
  }
  process.exit(0);
}
run();
