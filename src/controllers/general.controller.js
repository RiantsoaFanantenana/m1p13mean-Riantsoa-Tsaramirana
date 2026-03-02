import ShopProfile from "../models/shop/ShopProfile.js";
import FavoriteShop from "../models/client/FavoriteShop.js";
import Review from "../models/shop/Reviews.js";
import Event from "../models/shop/Event.js";

// Get shop event
export const getShopEvents = async (req, res) => {
  const { shopId } = req.params;

  const events = await Event.find({ shop: shopId });
  res.json(events);
};

// Get events
export const getEvents = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};
// Get reviews
export const getReviews = async (req, res) => {
  const { shopId } = req.params;

  const reviews = await Review.find({ shop: shopId })
    .populate("user", "name");

  res.json(reviews);
};


export const getShopProfile = async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;
  const { shopId } = req.params;

  const shop = await ShopProfile.findById(shopId)
  .populate({
        path: "box",
        select: "floorName boxNumber"
      });
  if (!shop) return res.status(404).json({ message: "Shop not found" });

  const isFavorite = await FavoriteShop.exists({
    user: userId,
    shop: shopId
  });

  res.json({
    ...shop.toObject(),
    isFavorite: !!isFavorite
  });
};

export const searchShops = async (req, res) => {
  const { q } = req.query;

  const shops = await ShopProfile.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ]
  });

  res.json(shops);
};
export const getShopByGroup = async (req, res) => {
  const { groupName } = req.params;
  
  const shops = [];
  if(groupName === "all"){
    shops = await ShopProfile.find();
    return res.json(shops);
  } else {
    shops = await ShopProfile.find({ group: groupName });
  }
  res.json(shops);
};