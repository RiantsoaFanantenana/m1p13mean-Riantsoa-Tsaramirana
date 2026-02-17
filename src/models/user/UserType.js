const mongoose = require("mongoose");

const UserTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["admin", "shop", "client"],
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("UserType", UserTypeSchema);
