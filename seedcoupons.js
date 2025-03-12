const mongoose = require('mongoose');
const Coupon = require('./models/coupon');

// MongoDB Atlas connection string (replace with your actual URI)
const MONGO_URI = "mongodb+srv://amankhan19989270mi:g4wVJtJ43gcP45ng@backend.gi02s.mongodb.net/?retryWrites=true&w=majority&appName=backend";

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error(err));

const seedCoupons = async () => {
  const coupons = [
    { coupon_code: 'COUPON1' },
    { coupon_code: 'COUPON2' },
    { coupon_code: 'COUPON3' },
  ];

  try {
    await Coupon.insertMany(coupons);
    console.log('Coupons seeded!');
  } catch (err) {
    console.error('Error seeding coupons:', err);
  } finally {
    mongoose.disconnect();
  }
};

// Seed coupons
seedCoupons();
