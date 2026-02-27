import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();
// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/register (client only)
router.post("/register", authController.registerClient);

export default router;
