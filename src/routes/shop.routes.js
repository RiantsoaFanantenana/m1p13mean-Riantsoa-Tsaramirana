import express from "express";
import { configureShop } from "../controllers/shop.controller.js";
import { configTokenMiddleware } from "../middlewares/verifyConfigToken.middleware.js";
import * as shopController from "../controllers/shop.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();
// POST /api/shop/log-unconfigured
router.post("/log-unconfigured", shopController.logUnconfigured);
// PATCH /api/shop/configure
router.patch("/configure", configTokenMiddleware, shopController.configureShop);

router.use(authenticate);
router.use(authorize("shop"));

// POST api/shop/create-coupon
router.post("/create-coupon", shopController.createCoupon);

// POST api/shop/pay
router.post("/pay", shopController.payShopCharges);

// POST api/shop/create-event
router.post("/create-event", shopController.createEvent);
// PATCH /api/shop/visual-identity/:shopId
router.patch("/visual-identity/:shopId", shopController.updateVisualIdentity);


export default router;
