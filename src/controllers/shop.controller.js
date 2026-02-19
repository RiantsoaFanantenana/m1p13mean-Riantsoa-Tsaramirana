import { completeShopConfiguration } from "../services/shop.services.js";
import {generateConfigToken} from "../services/shop.services.js";
import User from "../models/user/User.js";

// configure shop
export const configureShop = async (req, res) => {
  try {
    const { newPassword, logo, coverPic, description } = req.body;
    const user = req.user;

    const result = await completeShopConfiguration(user, { newPassword, logo, coverPic, description });

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

  const jwtToken = generateConfigToken(user._id);

  res.json({ token: jwtToken});

};
