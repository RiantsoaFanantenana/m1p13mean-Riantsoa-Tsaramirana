import User from "../models/user/User.js";
import ShopProfile from "../models/shop/ShopProfile.js";
import * as shopService from "../services/shop.services.js";

/**
 * POST /api/shop/pay
 * body: { periods: [{month, year}], charges: [{charge, amount, proofFiles}] }
 */
export const payShopCharges = async (req, res) => {
  try {
    const shop = await ShopProfile.findOne({ user: req.user.userId });
    if (!shop) return res.status(404).json({ message: "Boutique non trouvée" });

    const { periods, charges } = req.body;
    if (!periods || !charges) {
      return res.status(400).json({ message: "Periods et charges sont obligatoires" });
    }

    const result = await shopService.createShopPayement(shop._id, periods, charges);
    res.status(201).json({
      message: "Paiement créé avec succès. En attente de validation par l'admin.",
      payement: result.payement,
      totalPenalty: result.totalPenalty,
      periods: result.periodsWithPenalty
    });
  } catch (err) {
    console.error("Erreur lors du paiement :", err);
    res.status(400).json({ message: err.message });
  }
};
/**
 * =====================
 * EVENTS
 * =====================
 */
export const createEvent = async (req, res) => {
  try {
    const shopId = req.user._id; 
    const event = await shopService.createEvent(shopId, req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * =====================
 * COUPONS
 * =====================
 */
export const createCoupon = async (req, res) => {
  try {
    const shopId = req.user._id;
    const coupon = await shopService.createCoupon(shopId, req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getValidCoupons = async (req, res) => {
  try {
    const shopId = req.user._id;
    const coupons = await shopService.getValidCoupons(shopId);
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const redeemCoupon = async (req, res) => {
  try {
    const shopId = req.user._id;
    const { code } = req.body;
    const coupon = await shopService.redeemCoupon(shopId, code);
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// MODIFY PROFILE
export const updateVisualIdentity = async (req, res) => {
  try {
    const { shopId } = req.params;

    const {
      logo,
      coverPic,
      description
    } = req.body;

    const updatedShop = await ShopProfile.findByIdAndUpdate(
      shopId,
      {
        logo,
        coverPic,
        description
      },
      { new: true, runValidators: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({
      message: "Visual identity updated successfully",
      data: updatedShop
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// configure shop
export const configureShop = async (req, res) => {
  try {
    const { newPassword, logo, coverPic, description } = req.body;
    const user = req.user;

    const result = await shopService.completeShopConfiguration(user, { newPassword, logo, coverPic, description });

    res.json({ message: "Shop configured successfully", user: result.user, shopProfile: result.shopProfile });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// logUnconfigured
export const logUnconfigured = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const jwtToken = shopService.generateConfigToken(user._id);

  res.json({ token: jwtToken});

};
