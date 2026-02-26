const mongoose = require('mongoose');

const MonthlyChargeStatusSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopProfile',
    required: true
  },

  month: { type: Number, required: true },
  year: { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },

  payement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payement'
  }
});

MonthlyChargeStatusSchema.index(
  { shop: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model('MonthlyChargeStatus', MonthlyChargeStatusSchema)