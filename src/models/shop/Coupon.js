const mongoose = require("mongoose");

// Coupon Schema
const CouponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: String,
  discountType: { 
    type: String, 
    enum: ["percentage", "fixed"], 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true 
  },
  shop: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "ShopProfile", 
    required: true 
  },
  validFrom: { 
    type: Date, 
    required: true 
  },
  validUntil: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["active", "expired", "used"], 
    default: "active" 
  }
}, { timestamps: true });

CouponSchema.index({ code: 1, shop: 1 }, { unique: true });

module.exports = mongoose.model("Coupon", CouponSchema);