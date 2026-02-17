const mongoose = require("mongoose");

const ShopTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("ShopType", ShopTypeSchema);