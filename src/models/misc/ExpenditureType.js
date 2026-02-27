const mongoose = require('mongoose');
const ExpenditureTypeSchema = new mongoose.Schema({
    name: {type: String, required: true},
});
module.exports = mongoose.model('ExpenditureType', ExpenditureTypeSchema);