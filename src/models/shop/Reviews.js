const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "ShopProfile" },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProfile" },
  description: String,
  stars: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review",ReviewSchema);
