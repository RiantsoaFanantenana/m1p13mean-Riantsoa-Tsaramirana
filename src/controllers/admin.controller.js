
import User from '../models/user/User.js'
import ShopProfile from '../models/shop/ShopProfile.js';
import {createShopWithContract} from '../services/admin.services.js';

// =====================
// SHOP REGISTRATION (ADMIN ONLY)
// =====================
export const registerShop = async (req, res) => {
    console.log("BODY:", req.body);
  const { email, shopName, shopTypeId, duration, startDate, boxId } = req.body;  
    createShopWithContract({ shopName, email, shopType: shopTypeId, duration, startDate, boxId })
    .then(({ user, shopProfile, contract }) => {
      res.status(201).json({ message: "Shop registered successfully", user, shopProfile, contract });
    })
    .catch((error) => {
      console.error("Error registering shop:", error);
      res.status(500).json({ message: "Failed to register shop" });
    });
}
