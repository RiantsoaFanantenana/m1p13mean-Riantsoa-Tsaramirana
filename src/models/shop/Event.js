const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "ShopProfile", required: true },
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  isPublic: Boolean,
  status: {
    type: String,
    enum: ["draft", "published", "archived", "cancelled"],
    default: "draft"
  }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
