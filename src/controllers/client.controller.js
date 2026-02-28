import FavoriteShop from "../models/client/FavoriteShop.js";
import Wallet from "../models/client/Wallet.js";
import Reviews from "../models/shop/Reviews.js";
import { redeemCoupon } from "../services/client.services.js";

// Redeem coupon
export const redeemCouponController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId, code } = req.query;
    const coupon = await redeemCoupon(userId, shopId, code);
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Show wallet
export const showWallet = async (req, res) => {
  const userId = req.user.id;

  const wallet = await Wallet.findOne({ user: userId });

  res.json(wallet);
};

// Add review for a shop
export const addReview = async (userId, shopId, stars, description) => {
  const review = await Reviews.findOneAndUpdate(
    { user: userId, shop: shopId },
    { stars: stars, description: description },
    { upsert: true, new: true }
  );
  return review;
};


// Get favorites
export const getFavorites = async (req, res) => {
  const userId = req.user.id;

  const favorites = await Favorite.find({ user: userId })
    .populate("shop");

  res.json(favorites);
};

// Add shop to favorites
export const addFavoriteShop = async (userId, shopId) => {
  try {
    const favorite = await FavoriteShop.create({ user: userId, shop: shopId });
    return favorite;
  } catch (err) {
    if (err.code === 11000) throw new Error("Shop already in favorites");
    throw err;
  }
};