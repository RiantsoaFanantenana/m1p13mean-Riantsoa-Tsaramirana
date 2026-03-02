
import User from '../models/user/User.js'
import ShopProfile from '../models/shop/ShopProfile.js';
import BoxTicket from '../models/mall/BoxTicket.js';
import {createShopWithContract, getRevenuesAndExpenditures, getRevenueDetails, getExpenditureDetails } from '../services/admin.services.js';
import {getShopsWithCloseContractEnd, alertContractsEndingSoon} from '../services/admin.services.js';
import {acceptPayement} from '../services/admin.services.js';

// =====================
// ACCEPT PAYEMENT PROOF (ADMIN ONLY)
// =====================
export const acceptPayementController = async (req, res) => {
  try {
    const { payementId } = req.params;
    const payement = await acceptPayement(payementId);
    res.json({ message: "Payement accepted successfully", payement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// ALERT CONTRACTS ENDING SOON
// =====================
export const alertContractsEndingSoonController = async (req, res) => {
  try {
    const contracts = await getShopsWithCloseContractEnd();
    await alertContractsEndingSoon(contracts);
    res.json({ message: "Alerts sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// GET Shops with close contract end
// =====================
export const getShopsWithCloseContractEndController = async (req, res) => {
  try {
    const { daysBeforeEnd } = req.query;
    const shops = await getShopsWithCloseContractEnd(daysBeforeEnd);
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// GET EXPENDITURES DETAILS IN A PERIOD OF TIME
// =====================
export const getExpendituresDetailsController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const expenditures = await getExpenditureDetails(startDate, endDate);
    res.json(expenditures);
  }catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// GET REVENUES DETAILS IN A PERIOD OF TIME
// =====================
export const getRevenuesDetailsController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const revenues = await getRevenueDetails(startDate, endDate);
    res.json(revenues);
  }
    catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// GET REVENUES AND EXPENDITURES IN A PERIOD OF TIME
// =====================
export const getRevenuesAndExpendituresController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getRevenuesAndExpenditures(startDate, endDate);
    res.json(data);
  }
   catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// CHANGE TICKETS STATUS
// =====================
export const changeTicketStatus = async (req, res) => {
  try {
    const { ticketId, newStatus } = req.body;
    const ticket = await BoxTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    ticket.status = newStatus;
    await ticket.save();

    res.json({ message: "Ticket status updated successfully", ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// =====================
// LIST OF TICKETS
// =====================
export const listTickets = async (req, res) => {
    try {
        const tickets = await BoxTicket.find().populate('box').populate('shopProfile');
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// =====================
// SHOP REGISTRATION (ADMIN ONLY)
// =====================
export const registerShop = async (req, res) => {
    console.log("BODY:", req.body);
  const { email, shopName, shopTypeId, duration, startDate, boxId } = req.body;  
    createShopWithContract({ shopName, email, shopType: shopTypeId, duration, startDate, boxId })
    .then(({ user, shopProfile, contract }) => {
      res.status(201).json({ message: "Shop registered successfully", user, shopProfile, contract });
    })
    .catch((error) => {
      console.error("Error registering shop:", error);
      res.status(500).json({ message: "Failed to register shop" });
    });
}
