const mongoose = require('mongoose');
const ChargeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    month_frequency: { type: Number, required: true, default: 1 },
    unit_price: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Charge', ChargeSchema);