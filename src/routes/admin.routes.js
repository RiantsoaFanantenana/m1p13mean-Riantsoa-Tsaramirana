const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

// POST /api/admin/register-shop
router.post("/register-shop", adminController.registerShop);

module.exports = router;