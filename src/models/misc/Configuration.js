const mongoose = require("mongoose");

const ConfigurationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type:  mongoose.Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model("Configuration", ConfigurationSchema);
