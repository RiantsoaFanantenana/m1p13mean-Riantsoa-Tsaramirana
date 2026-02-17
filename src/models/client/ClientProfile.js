const mongoose = require("mongoose");

const ClientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    userName: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    birthDate: Date,

    favoriteShops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopProfile"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientProfile", ClientProfileSchema);
