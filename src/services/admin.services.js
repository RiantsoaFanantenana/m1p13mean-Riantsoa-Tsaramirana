import User from '../models/user/User.js';
import ShopProfile from '../models/shop/ShopProfile.js';
import Contract from '../models/mall/Contract.js';
import crypto from 'crypto';
import { sendEmail } from './email.services.js';
import { referenceIds } from '../config/referenceIds.js';

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
