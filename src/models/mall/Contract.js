const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema ({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopProfile", required: true},
    startDate: {type: Date, required: true},
    duration: {type: Number, required: true, min:1},
    endDate: {type: Date, required: true},});

contractSchema.pre("validate", function (next) {
  if (this.startDate && this.duration) {
    const end = new Date(this.startDate);
    end.setMonth(end.getMonth() + this.duration);
    this.endDate = end;
  }
});

const Contract = mongoose.model("Contract", contractSchema);
module.exports = Contract;