import UserType from '../models/user/UserType.js';
import User from '../models/user/User.js';
import ShopType from '../models/shop/ShopType.js';
import SubscriptionType from '../models/mall/SubscriptionType.js';
import Configuration from '../models/misc/Configuration.js';
import {hashPassword} from '../util/password.util.js';
import Charge from '../models/misc/Charge.js';

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
