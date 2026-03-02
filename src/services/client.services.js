import Coupon from "../models/shop/Coupon.js";
import Wallet from "../models/client/Wallet.js";
/**
 * Marque un coupon comme utilisé
 */
export const redeemCoupon = async (userId, shopId, code) => {
  const coupon = await Coupon.findOne({
    shop: shopId,
    code,
    status: "active"
  });

  if (!coupon) throw new Error("Coupon invalide ou expiré");

  coupon.status = "used";
  await coupon.save();

  const wallet = await Wallet.findOne({ user: userId }) || await Wallet.create({ user: userId });
  if (!wallet.coupons.includes(coupon._id)) {
    wallet.coupons.push(coupon._id);
    await wallet.save();
  }

  return coupon;
};
