const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

// GET /api/admin/expenditures-details
router.get("/expenditures-details", adminController.getExpenditureDetails);

// GET /api/admin/revenues-details
router.get("/revenues-details", adminController.getRentRevenuesDetails);
// GET /api/admin/revenues-expenditures
router.get("/revenues-expenditures", adminController.getRevenuesAndExpenditures);

// POST /api/admin/register-shop
router.post("/register-shop", adminController.registerShop);

module.exports = router;