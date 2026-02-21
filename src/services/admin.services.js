import User from '../models/user/User.js';
import ShopProfile from '../models/shop/ShopProfile.js';
import Contract from '../models/mall/Contract.js';
import crypto from 'crypto';
import Payement from "../models/shop/Payement.js";
import Expenditure from "../models/misc/Expenditure.js";
import Configuration from '../models/misc/Configuration.js';
import { sendEmail } from './email.services.js';
import { referenceIds } from '../config/referenceIds.js';
import { buildDateFilter } from "../util/date.util.js";
import {generateInvoicePDF} from "./pdf.services.js"

// ACCEPT PAYEMENT PROOF (ADMIN ONLY)
export const acceptPayement = async (payementId) => {
  const payement = await Payement.findById(payementId)
    .populate("shop")    
    .populate("charge");   

  if (!payement) throw new Error("Payement not found");

  payement.status = "accepted";
  await payement.save();

  const chargeDetails = [payement.charge].map((c) => ({
    name: c.name,
    amount: payement.amount,
  }));

  payement.chargeDetails = chargeDetails; 

  const pdfPath = await generateInvoicePDF(payement);

  await sendInvoiceEmail(payement.shop.user.email, payement, pdfPath);

  return payement;
};

// ALERT FOR CONTRACTS ENDING 
export const alertContractsEndingSoon = async ([contracts]) => {
  try {
    for (const contract of contracts) {
      const shop = contract.shop;
      const user = await User.findById(shop.user);
      await sendEmail(user.email, 'Alerte : Fin de contrat proche', `
        Bonjour ${shop.shopName},
        Votre contrat avec le mall se termine bientôt (le ${contract.endDate.toLocaleDateString()}).
        Veuillez contacter l'administration pour le renouvellement ou la résiliation de votre contrat.
      `);
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi des alertes de fin de contrat :", err);
  }
};

/**
 * GET SHOPS WITH CONTRACT ENDING IN A PERIOD OF TIME
 * @param {number} daysBeforeEnd - days before contract end to trigger the alert (optional, default from configuration or 7 days)
 * @returns {Promise<Array>} - List of shops with contracts ending within the specified period, including shop details and contract end date
 */
export const getShopsWithCloseContractEnd = async (daysBeforeEnd) => {
  try {
    const configuration = await Configuration.findOne({ key: "contract_alert_days" });
    const alertDays = daysBeforeEnd ?? (configuration ? parseInt(configuration.value) : 7);

    const today = new Date();
    const targetDate = new Date(today.getTime() + alertDays * 24 * 60 * 60 * 1000);

    const contracts = await Contract.find({
      endDate: { $gte: today, $lte: targetDate }
    }).populate({
      path: "shop",
      select: "shopName user box shopType"
    });

    return contracts;
  } catch (err) {
    throw err;
  }
};

// EXPENDITURES DETAILS
export const getExpenditureDetails = async (startDate, endDate) => {
  const dateFilter = buildDateFilter(startDate, endDate);
  const matchStage = {};

  if (dateFilter) {
    matchStage.date = dateFilter;
  }

  const expenditures = await Expenditure.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "expendituretypes",   
        localField: "expenditureType",
        foreignField: "_id",
        as: "typeInfo"
      }
    },
    { $unwind: "$typeInfo" },
    {
      $group: {
        _id: "$typeInfo.name",   
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
  return expenditures;
};

// =====================
// REVENUE DETAILS (group by charge name)
// =====================
export const getRevenueDetails = async (startDate, endDate) => {
  const dateFilter = buildDateFilter(startDate, endDate);

  const matchStage = {
    status: "accepted"
  };
  if (dateFilter) {
    matchStage.date = dateFilter;
  }

  const revenues = await Payement.aggregate([
    { $match: matchStage },
    { $unwind: "$charges" }, 
    {
      $lookup: {
        from: "charges",
        localField: "charges.charge",
        foreignField: "_id",
        as: "chargeInfo"
      }
    },
    { $unwind: "$chargeInfo" },
    {
      $group: {
        _id: "$chargeInfo.name",
        totalAmount: { $sum: "$charges.amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);

  return revenues;
};

// =====================
// REVENUES AND EXPENDITURES ANALYTICS
// =====================
export const getRevenuesAndExpenditures = async (startDate, endDate) => {
  const dateFilter = buildDateFilter(startDate, endDate);

  const matchStage = {};
  if (dateFilter) {
    matchStage.date = dateFilter;
  }

  try {
    // Expenditures
    const expenditures = await Expenditure.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalExpenditure: { $sum: "$amount" } } }
    ]);

    // Revenues 
    const revenues = await Payement.aggregate([
      { $match: { status: "accepted", ...matchStage } },
      { $unwind: "$charges" },
      { $group: { _id: null, totalRevenue: { $sum: "$charges.amount" } } }
    ]);

    return {
      totalExpenditure: expenditures[0] ? expenditures[0].totalExpenditure : 0,
      totalRevenue: revenues[0] ? revenues[0].totalRevenue : 0
    };
  } catch (err) {
    throw err;
  }
};

// SHOP REGISTRATION (ADMIN ONLY)
export const createShopWithContract = async ({ shopName, email, shopType, duration, startDate, boxId }) => {

  // 1️) Generate a random password for the shop owner
  const generatedPassword = crypto.randomBytes(6).toString('hex'); 

  // 2️) Create the user account for the shop owner
  const user = await User.create({
    email,
    password: generatedPassword, 
    userType: referenceIds.shop_id,
    isConfigured: false
  });

  // 3️) Create the shop profile
  const shopProfile = await ShopProfile.create({
    user: user._id,
    shopName,
    shopType, 
    box: boxId
  });

  // 4️) Create the contract linking the shop to the mall
  const contract = await Contract.create({
    shop: shopProfile._id,
    startDate,
    duration,
    box: boxId
  });

  // 5️) Send an email to the shop owner with their credentials and a link to configure their account
  const configLink = process.env.ACCOUNT_CONFIGURATION_LINK;
  await sendEmail(email, 'Configuration de votre boutique', `
    Bonjour ${shopName},
    Votre compte a été créé. Voici votre mot de passe temporaire : ${generatedPassword}
    Cliquez sur ce lien pour configurer votre compte : ${configLink}
  `);

  return { user, shopProfile, contract };
};
