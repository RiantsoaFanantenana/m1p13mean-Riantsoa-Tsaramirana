const UserType = require("../models/user/UserType");
const ShopType = require("../models/shop/ShopType");
const SubscriptionType = require("../models/mall/SubscriptionType");

const seedData = async () => {
  // -------- UserType --------
  const userTypes = ["admin", "shop", "client"];
  for (const name of userTypes) {
    await UserType.updateOne(
      { name },
      { name },
      { upsert: true } // crée si pas existant
    );
  }

  // -------- ShopType --------
  const shopTypes = ["clothing", "electronics", "food", "books", "home", "sports", "beauty", "toys", "automotive", "health", "jewelry", "music", "office", "pet", "garden", "baby", "art", "handmade", "grocery", "furniture"];
  for (const name of shopTypes) {
    await ShopType.updateOne(
      { name },
      { name },
      { upsert: true }
    );
  }

  // -------- SubscriptionType --------
  const subscriptionTypes = [
    { name: "Basic", hasPushNotification: false, hasBadge: false },
    { name: "Premium", hasPushNotification: true, hasBadge: true },
  ];
  for (const type of subscriptionTypes) {
    await SubscriptionType.updateOne(
      { name: type.name },
      type,
      { upsert: true }
    );
  }

  console.log("✅ Seed data completed");
};

module.exports = seedData;
