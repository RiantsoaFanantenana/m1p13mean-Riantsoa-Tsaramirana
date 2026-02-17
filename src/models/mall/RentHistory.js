const mongoose = require("mongoose");

const RentHistorySchema = new mongoose.Schema({
  box: { type: mongoose.Schema.Types.ObjectId, ref: "Box", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RentHistory", RentHistorySchema);
