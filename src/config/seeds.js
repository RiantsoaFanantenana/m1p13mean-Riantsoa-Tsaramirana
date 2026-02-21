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

  // User
  const users = [
    {
      "email": "admin@mall.com",
      "password": "admin123",
      "userType": UserType.findOne({ name: "admin" })._id,
      "isConfigured": true
    }
  ];
  for (const userData of users) {
    await User.updateOne(
      { email: userData.email },
      userData,
      { upsert: true }
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

  // -------- Configuration (Allowed Config Tables) --------
  await Configuration.updateOne(
    { key: "allowed_config_tables" },
    {
      key: "allowed_config_tables",
      value: [
        {
          alias: "shop-types",
          model: "ShopType"
        },
        {
          alias: "subscription-types",
          model: "SubscriptionType"
        },
        {
          alias: "boxes",
          model: "Box"
        },
                {
          alias: "opening-hours",
          model: "OpeningHour"
        },
        {
          alias: "subscriptions",
          model: "Subscriptions"
        }
      ]
    },
    { upsert: true }
  );

  // / -------- Business Configurations --------

  // J-7 par défaut avant expiration
  await Configuration.updateOne(
    { key: "contract_alert_days" },
    { key: "contract_alert_days", value: 7 },
    { upsert: true }
  );

  // Jour limite paiement loyer (ex : 5 du mois)
  await Configuration.updateOne(
    { key: "limit_rent_payment_day" },
    { key: "limit_rent_payment_day", value: 5 },
    { upsert: true }
  );
  console.log("✅ Seed data completed");
};

module.exports = seedData;
