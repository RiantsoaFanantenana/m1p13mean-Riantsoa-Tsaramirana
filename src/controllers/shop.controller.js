import { completeShopConfiguration } from "../services/shop.services.js";
import {generateConfigToken} from "../services/shop.services.js";
import User from "../models/user/User.js";
import ShopProfile from "../models/shop/ShopProfile.js";

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
