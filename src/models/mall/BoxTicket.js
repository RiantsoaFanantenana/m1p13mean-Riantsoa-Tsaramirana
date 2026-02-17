const mongoose = require("mongoose");

const BoxTicketSchema = new mongoose.Schema({
    shop : {type : mongoose.Schema.Types.ObjectId, ref:"ShopProfile", required: true},
    description: {type: String, required: true},
    validation_date: Date,
    rejection_date: Date,
}, { timestamps: true });

module.exports = mongoose.model("BoxTicket", BoxTicketSchema);