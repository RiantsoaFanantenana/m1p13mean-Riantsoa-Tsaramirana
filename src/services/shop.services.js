import User from "../models/user/User.js";
import ShopProfile from "../models/shop/ShopProfile.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Event from "../models/shop/Event.js";
import Coupon from "../models/shop/Coupon.js";
import { nanoid } from "nanoid";
import Payement from "../models/shop/Payement.js";
import MonthlyChargeStatus from "../models/shop/MonthlyChargeStatus.js";
import Configuration from "../models/misc/Configuration.js";
import Charge from "../models/misc/Charge.js";

/**
 * Crée un paiement pour un shop avec calcul automatique du montant des charges
 * @param {ObjectId} shopId 
 * @param {Array} periods - [{month, year}]
 * @param {Array<ObjectId>} chargeIds - Ids des charges choisies par le shop
 */
export const createShopPayement = async (shopId, periods, chargeIds) => {
  const shop = await ShopProfile.findById(shopId).populate("box");

  if (!shop) throw new Error("Boutique introuvable");

  // 1) Vérifier si les périodes sont déjà payées
  for (const period of periods) {

    let monthlyStatus = await MonthlyChargeStatus.findOne({
      shop: shopId,
      month: period.month,
      year: period.year
    });

    // 1️⃣ Si inexistant → on le crée
    if (!monthlyStatus) {
      monthlyStatus = await MonthlyChargeStatus.create({
        shop: shopId,
        month: period.month,
        year: period.year,
        status: "pending"
      });
    }

    // 2️⃣ Si déjà payé → erreur
    if (monthlyStatus.status === "paid") {
      throw new Error(
        `Le mois ${period.month}/${period.year} est déjà payé`
      );
    }

    // // 3️⃣ Mettre en review et lier au paiement
    // monthlyStatus.payement = payement._id;
    // await monthlyStatus.save();
  }
  // 2) Calculer les montants automatiquement
  const charges = [];
  for (const chargeId of chargeIds) {
    const charge = await Charge.findById(chargeId);
    if (!charge) throw new Error("Charge introuvable");

    let amount = 0;

    if (charge.name.toLowerCase().includes("rent")) {
      // Loyer = superficie du box * prix unitaire
      amount = shop.box.surfaceArea * charge.unit_price;
      console.log(`Calcul loyer: ${shop.box.surfaceArea} m² * ${charge.unit_price} = ${amount}`);
    } else {
      // Autres charges
      amount = charge.unit_price;
      console.log(`Charge ${charge.name}: montant fixe = ${amount}`);
    }

    charges.push({
      charge: charge._id,
      amount,
      proofFiles: []
    });
  }

  // 3) Calcul pénalités retard (comme avant)
  const penaltyConfig = await Configuration.findOne({ key: "late_payment_penalty_per_day" });
  const penaltyAmount = penaltyConfig ? parseInt(penaltyConfig.value) : 5000;
  const today = new Date();
  const periodsWithPenalty = [];
  let totalPenalty = 0;

  const dueDayConfig = await Configuration.findOne({ key: "rent_due_day" });
  const dueDay = dueDayConfig ? parseInt(dueDayConfig.value) : 7;

  for (const period of periods) {
    const periodDueDate = new Date(period.year, period.month - 1, dueDay);
    let lateDays = 0;

    if (today > periodDueDate) {
      lateDays = Math.floor((today - periodDueDate) / (1000 * 60 * 60 * 24));
      totalPenalty += lateDays * penaltyAmount;
    }

    periodsWithPenalty.push({
      month: period.month,
      year: period.year,
      lateDays,
      penalty: lateDays * penaltyAmount
    });
  }

  // 4) Créer le paiement
  const payement = await Payement.create({
    shop: shopId,
    status: "review",
    periods,
    charges
  });

  return { payement, totalPenalty, periodsWithPenalty };
};

/**
 * =====================
 * EVENTS
 * =====================
 */

/**
 * Crée un nouvel événement pour une boutique
 */
export const createEvent = async (shopId, { title, description, startDate, endDate, isPublic }) => {
  const event = await Event.create({
    shop: shopId,
    title,
    description,
    startDate,
    endDate,
    isPublic,
    status: "draft"
  });
  return event;
};

/**
 * =====================
 * COUPONS
 * =====================
 */

/**
 * Crée un coupon pour une boutique
 */
export const createCoupon = async (shopId, { code, description, discountType, discountValue, validFrom, validUntil }) => {
  const couponCode = code || nanoid(8).toUpperCase();
  const coupon = await Coupon.create({
    shop: shopId,
    code: couponCode,
    description,
    discountType,
    discountValue,
    validFrom,
    validUntil,
    status: "active"
  });
  return coupon;
};

/**
 * Récupère tous les coupons valides pour une boutique
 */
export const getValidCoupons = async (shopId) => {
  const now = new Date();
  return await Coupon.find({
    shop: shopId,
    status: "active",
    validFrom: { $lte: now },
    validUntil: { $gte: now }
  });
};

/**
 * Marque un coupon comme utilisé
 */
export const redeemCoupon = async (shopId, code) => {
  const coupon = await Coupon.findOne({
    shop: shopId,
    code,
    status: "active"
  });

  if (!coupon) throw new Error("Coupon invalide ou expiré");

  coupon.status = "used";
  await coupon.save();

  return coupon;
};

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
