const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema ({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopProfile", required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},});

const Contract = mongoose.model("Contract", contractSchema);