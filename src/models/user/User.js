const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserType",
    required: true
  },
  isConfigured: {type: Boolean, default: true}
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
