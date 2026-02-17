const mongoose = require("mongoose");

const OpeningHoursExceptionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    open_time: { type: String, required: true },
    close_time: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("OpeningHoursException", OpeningHoursExceptionSchema);