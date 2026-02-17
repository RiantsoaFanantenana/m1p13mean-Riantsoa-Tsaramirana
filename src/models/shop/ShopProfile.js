const mongoose = require("mongoose");

const ShopProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shopType: { type: mongoose.Schema.Types.ObjectId, ref: "ShopType" },
  box: { type: mongoose.Schema.Types.ObjectId, ref: "Box" },
  shopName: String,
  logo: String,
  coverPic: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("ShopProfile", ShopProfileSchema);
