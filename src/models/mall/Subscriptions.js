const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    shop : {type: mongoose.Schema.Types.ObjectId, ref: "ShopProfile", required: true},
    startDate : {type: Date, required: true},
    endDate : {type: Date, required: true},
    rupturedDate : {type: Date, required: true},
    status : {type: String, enum: ["active", "inactive", "ruptured"], default: "active"}
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);