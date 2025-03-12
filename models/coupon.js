const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  coupon_code: String,
  is_claimed: { type: Boolean, default: false },
  claimed_at: Date,
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
