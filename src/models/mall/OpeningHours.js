const mongoose = require("mongoose");

const OpeningHoursSchema = new mongoose.Schema({
    day: { type: String, required: true },
    open_time: { type: String, required: true },
    close_time: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("OpeningHours", OpeningHoursSchema);