const mongoose = require("mongoose");
const BoxSchema = new mongoose.Schema({
    boxNumber: { type: String, required: true, unique: true },
    floor: Number,
    mapReference: String,
});

module.exports = mongoose.model("Box", BoxSchema);
