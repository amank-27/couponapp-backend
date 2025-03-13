const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Coupon = require('./models/coupon');

const app = express();

// MongoDB Atlas connection string (replace with your actual URI)
const MONGO_URI = "mongodb+srv://amankhan19989270mi:g4wVJtJ43gcP45ng@backend.gi02s.mongodb.net/?retryWrites=true&w=majority&appName=backend";

// Middleware
app.use(cors());              // Enable CORS
app.use(cookieParser());      // Parse cookies
app.use(express.json());      // Parse JSON data

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error(err));

// In-memory store to track last claim time by IP
const ipClaims = {};

const COUPON_TIME_FRAME = 60 * 60 * 1000; // 1 hour in milliseconds

// Function to get the real IP address, considering proxies
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

// Endpoint to claim a coupon
app.get('/claim-coupon', async (req, res) => {
  const ip = getClientIp(req);  // Using the helper function to get the real IP
  const now = Date.now();

  // Check if IP has claimed a coupon recently
  if (ipClaims[ip] && now - ipClaims[ip] < COUPON_TIME_FRAME) {
    return res.status(403).json({ message: "You've already claimed a coupon. Please wait before trying again." });
  }

  // Find the first unclaimed coupon
  const coupon = await Coupon.findOne({ is_claimed: false });

  if (!coupon) {
    return res.status(404).json({ message: "No coupons available at the moment." });
  }

  // Mark the coupon as claimed
  coupon.is_claimed = true;
  coupon.claimed_at = now;
  await coupon.save();

  // Set a cookie to prevent abuse within the same session
  res.cookie('coupon_claimed', true, { maxAge: COUPON_TIME_FRAME });

  // Update IP claim time
  ipClaims[ip] = now;

  res.json({
    message: "Coupon claimed successfully!",
    coupon_code: coupon.coupon_code,
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
