const mongoose = require("mongoose");

const SubscriptionTypeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  has_push_notification: {type: Boolean, required: true},
  has_badge: {type: Boolean, required: true},
});

const SubscriptionType = mongoose.model("SubscriptionType", SubscriptionTypeSchema);
module.exports = SubscriptionType;