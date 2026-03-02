import cron from "node-cron";
import MonthlyChargeStatus from "../models/shop/MonthlyChargeStatus.js";
import ShopProfile from "../models/shop/ShopProfile.js";

export const ensureCurrentMonthGenerated = async () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const existing = await MonthlyChargeStatus.findOne({ month, year });

  if (!existing) {
    console.log("⚠ Charges non générées ce mois, génération automatique...");
    await generateMonthlyChargeStatus();
  }
};

/**
 * Génère les MonthlyChargeStatus pour le mois courant
 */
export const generateMonthlyChargeStatus = async () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  console.log(`📅 Génération des charges pour ${month}/${year}`);

  const shops = await ShopProfile.find({});

  for (const shop of shops) {
    try {
      await MonthlyChargeStatus.create({
        shop: shop._id,
        month,
        year,
        status: "pending"
      });
    } catch (err) {
      // Ignore les doublons grâce à l'index unique
      if (err.code !== 11000) {
        console.error("Erreur génération charge :", err);
      }
    }
  }

  console.log("✅ Génération mensuelle terminée");
};