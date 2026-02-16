const mongoose = require("mongoose");

const ClientCouponSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientProfile", unique: true },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", unique: true }
});

module.exports = mongoose.model("ClientCoupon", ClientCouponSchema);
