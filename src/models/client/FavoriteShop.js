import mongoose from "mongoose";

const FavoriteShopSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "ShopProfile", required: true },
}, { timestamps: true });

FavoriteShopSchema.index({ user: 1, shop: 1 }, { unique: true });

export default mongoose.model("FavoriteShop", FavoriteShopSchema);