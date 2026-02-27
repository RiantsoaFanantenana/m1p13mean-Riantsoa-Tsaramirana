import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();
router.use(authenticate);
router.use(authorize("admin"));

// GET api/admin/accept-payement/:payementId
router.get("/accept-payement/:payementId", adminController.acceptPayementController);

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

export default router;