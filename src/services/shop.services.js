import User from "../models/user/User.js";
import ShopProfile from "../models/shop/ShopProfile.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * Génère le JWT temporaire de configuration
 */
export const generateConfigToken = (userId) => {
  return jwt.sign(
    { userId, type: "config" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

/**
 * Vérifie le token et retourne l'utilisateur non-configuré
 */
export const verifyConfigToken = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.type !== "config") throw new Error("Invalid token type");

    const user = await User.findById(payload.userId);
    if (!user || user.isConfigured) throw new Error("User already configured or invalid");

    return user;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Termine la configuration du shop
 * @param {User} user - l'utilisateur à configurer
 * @param {Object} data - nouvelles informations (logo, coverPic, description, mot de passe)
 */
export const completeShopConfiguration = async (user, { newPassword, logo, coverPic, description }) => {
  // 1) Change password and configuraition field
  user.password = newPassword; 
  user.isConfigured = true;
  await user.save();

  // 2) mettre à jour le ShopProfile avec uniquement les champs modifiables
  const shopProfile = await ShopProfile.findOne({ user: user._id });
  if (!shopProfile) throw new Error("ShopProfile not found");

  shopProfile.logo = logo;
  shopProfile.coverPic = coverPic;
  shopProfile.description = description;

  await shopProfile.save();

  return { user, shopProfile };
};
