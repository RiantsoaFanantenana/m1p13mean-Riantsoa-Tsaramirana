const mongoose = require("mongoose");

const SubscriptionPriceHistorySchema = new mongoose.Schema({
    subscriptionType: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionType", required: true },
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true },
});

module.exports = mongoose.model("SubscriptionPriceHistory", SubscriptionPriceHistorySchema);