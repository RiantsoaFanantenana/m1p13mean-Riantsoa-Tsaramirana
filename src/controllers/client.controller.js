import FavoriteShop from "../models/client/FavoriteShop.js";
import Wallet from "../models/client/Wallet.js";
import Reviews from "../models/shop/Reviews.js";

// Add review for a shop
export const addReview = async (userId, shopId, stars, description) => {
  const review = await Reviews.findOneAndUpdate(
    { user: userId, shop: shopId },
    { stars: stars, description: description },
    { upsert: true, new: true }
  );
  return review;
};

// Add coupon to wallet
export const addCouponToWallet = async (userId, couponId) => {
  const wallet = await Wallet.findOne({ user: userId }) || await Wallet.create({ user: userId });
  if (!wallet.coupons.includes(couponId)) {
    wallet.coupons.push(couponId);
    await wallet.save();
  }
  return wallet;
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