const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

// GET /api/admin/alert-contracts-ending-soon
router.get("/alert-contracts-ending-soon", adminController.alertContractsEndingSoonController);

// GET /api/admin/shops-close-contract-end
router.get("/shops-close-contract-end", adminController.getShopsWithCloseContractEndController);

// GET /api/admin/expenditures-details
router.get("/expenditures-details", adminController.getExpendituresDetailsController);

// GET /api/admin/revenues-details
router.get("/revenues-details", adminController.getRevenuesDetailsController);
// GET /api/admin/revenues-expenditures
router.get("/revenues-expenditures", adminController.getRevenuesAndExpendituresController);

// POST /api/admin/register-shop
router.post("/register-shop", adminController.registerShop);

module.exports = router;