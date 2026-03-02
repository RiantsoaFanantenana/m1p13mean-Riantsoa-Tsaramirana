import * as clientController from "../controllers/client.controller.js";

import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();
router.use(authenticate);
router.use(authorize("client"));

// GET /api/client/redeem-coupon
router.get("/redeem-coupon/:shopId/:code", clientController.redeemCouponController);

// GET api/client/wallet
router.get("/wallet", clientController.showWallet);

// POST /api/client/post-review/:shopId
router.post("/post-review/:shopId", clientController.addReview);
// GET /api/client/get-favorites
router.get("/get-favorites", clientController.getFavorites);

// POST /api/client/add-shop-favorite/:shopId
router.post("/add-shop-favorite/:shopId", clientController.addFavoriteShop);

export default router;