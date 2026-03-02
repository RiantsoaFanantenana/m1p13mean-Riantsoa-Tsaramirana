import UserType from '../models/user/UserType.js';
import User from '../models/user/User.js';
import Box from '../models/mall/Box.js';
import ShopProfile from '../models/shop/ShopProfile.js';
import ShopType from '../models/shop/ShopType.js';
import SubscriptionType from '../models/mall/SubscriptionType.js';
import Configuration from '../models/misc/Configuration.js';
import {hashPassword} from '../util/password.util.js';
import Charge from '../models/misc/Charge.js';
import OpeningHours from '../models/mall/OpeningHours.js';

export const seedAdminUser = async () => {
  try {
    console.log("🔹 Seeding admin user...");

    // 1️⃣ Vérifier que le UserType admin existe
    const adminUserType = await UserType.findOne({ name: "admin" });

    if (!adminUserType) {
      throw new Error("UserType 'admin' not found. Seed UserTypes first.");
    }

    // 2️⃣ Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: "admin@mall.com" });

    if (!existingUser) {
      console.log("➕ Creating admin user...");

      // 3️⃣ Hash password
      const hashedPassword = "admin123";

      await User.create({
        email: "admin@mall.com",
        password: hashedPassword,
        userType: adminUserType._id,
        isConfigured: true
      });

      console.log("✅ Admin user created successfully.");

    } else {
      console.log("🔄 Admin user already exists. Updating fields...");

      // 4️⃣ Update sans toucher au password
      existingUser.userType = adminUserType._id;
      existingUser.isConfigured = true;

      await existingUser.save();

      console.log("✅ Admin user updated.");
    }

  } catch (err) {
    console.error("❌ Error seeding admin user:", err.message);
    throw err;
  }
}


export const seedData = async () => {
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

  
  // Charges
  const chargesConfig = [
    { name: "rent", month_frequencey : 1, unit_price: 1000 },
    { name: "subscription", month_frequencey : 1, unit_price: 200 },
  ];
  for (const charge of chargesConfig) {
    await Charge.updateOne(
      { name: charge.name },
      { name: charge.name, month_frequencey: charge.month_frequencey, unit_price: charge.unit_price },
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
          model: "OpeningHours"
        },
        {
          alias: "subscriptions",
          model: "Subscriptions"
        }
      ]
    },
    { upsert: true }
  );

  // -------- Opening Hours (Default Mall Schedule) --------
  const defaultOpeningHours = [
    { day: "Monday", open_time: "09:00", close_time: "20:00" },
    { day: "Tuesday", open_time: "09:00", close_time: "20:00" },
    { day: "Wednesday", open_time: "09:00", close_time: "20:00" },
    { day: "Thursday", open_time: "09:00", close_time: "21:00" },
    { day: "Friday", open_time: "09:00", close_time: "22:00" },
    { day: "Saturday", open_time: "10:00", close_time: "22:00" },
    { day: "Sunday", open_time: "10:00", close_time: "18:00" },
  ];

  for (const schedule of defaultOpeningHours) {
    await OpeningHours.updateOne(
      { day: schedule.day }, // 1 entrée par jour
      schedule,
      { upsert: true }
    );
  }

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

export const seedShops = async () => {
  // -------- Shop Users --------
  const shopUserType = await UserType.findOne({ name: "shop" });

  const shopUsers = [
    { email: "elysian@mall.com" },
    { email: "stellar@mall.com" },
    { email: "chocolat@mall.com" },
    { email: "velvet@mall.com" }
  ];

  for (const u of shopUsers) {

    const existing = await User.findOne({ email: u.email });

    if (!existing) {
      await User.create({
        email: u.email,
        password: await hashPassword("password123"),
        userType: shopUserType._id,
        isConfigured: true
      });
    }
  }

  console.log("✅ Shop users seeded.");
  // -------- Shops --------

  const mockShops = [
    {
      email: "elysian@mall.com",
      shopType: "clothing",
      boxCode: "BOX-C1",
      shopName: "Elysian Garments"
    },
    {
      email: "stellar@mall.com",
      shopType: "jewelry",
      boxCode: "BOX-B5",
      shopName: "Stellar Gems"
    },
    {
      email: "chocolat@mall.com",
      shopType: "food",
      boxCode: "BOX-A2",
      shopName: "L'Art du Chocolat"
    },
    {
      email: "velvet@mall.com",
      shopType: "beauty",
      boxCode: "BOX-A6",
      shopName: "Velvet Skin"
    }
  ];

  for (const shopData of mockShops) {

    const user = await User.findOne({ email: shopData.email });
    const type = await ShopType.findOne({ name: shopData.shopType });
    const box = await Box.findOne({ boxNumber: shopData.boxCode });

    if (!user || !type || !box) {
      console.log("⚠️ Missing dependency for", shopData.shopName);
      continue;
    }

    await ShopProfile.updateOne(
      { shopName: shopData.shopName },
      {
        user: user._id,
        shopType: type._id,
        box: box._id,
        shopName: shopData.shopName,
        logo: `https://api.dicebear.com/7.x/initials/svg?seed=${shopData.shopName}`,
        coverPic: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
        description: "Premium luxury experience."
      },
      { upsert: true }
    );
  }
  console.log("✅ Shops seeded.");
};
