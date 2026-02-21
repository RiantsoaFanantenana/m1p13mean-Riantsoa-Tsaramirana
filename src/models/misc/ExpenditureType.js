const mongoose = require('mongoose');
const ExpenditureTypeSchema = new miongoose.Schema({
    name: {type: String, required: true},
});
module.exports = mongoose.model('ExpenditureType', ExpenditureTypeSchema);