import express from "express";
import { configureShop } from "../controllers/shop.controller.js";
import { configTokenMiddleware } from "../middlewares/verifyConfigToken.middleware.js";
import { logUnconfigured } from "../controllers/shop.controller.js";

const router = express.Router();

// PATCH /api/shop/configure
router.patch("/configure", configTokenMiddleware, configureShop);

// POST /api/shop/log-unconfigured
router.post("/log-unconfigured", logUnconfigured);
export default router;
