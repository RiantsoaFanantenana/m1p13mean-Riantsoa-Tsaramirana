const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "ShopProfile" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  stars: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

ReviewSchema.index({ client: 1, shop: 1 }, { unique: true });

module.exports = mongoose.model("Review",ReviewSchema);
