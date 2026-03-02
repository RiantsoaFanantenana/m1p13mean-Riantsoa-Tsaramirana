import cron from "node-cron";
import { generateMonthlyChargeStatus } from "../services/monthlyCharge.generator.js";

/**
 * CRON : Tous les 1er du mois à 00h05
 */
export const startMonthlyChargeCron = () => {
  cron.schedule("5 0 1 * *", async () => {
    console.log("⏳ Lancement CRON mensuel...");
    await generateMonthlyChargeStatus();
  });
};