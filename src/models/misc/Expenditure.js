const mongoose = require('mongoose');
const ExpenditureSchema = new mongoose.Schema({
    object: {type: String, required: true},
    expenditureType: {type: mongoose.Schema.Types.ObjectId, ref: 'ExpenditureType', required: true},
    amount: {type: Number, required: true},
    description: {type: String, required: true},
    date: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Expenditure', ExpenditureSchema);