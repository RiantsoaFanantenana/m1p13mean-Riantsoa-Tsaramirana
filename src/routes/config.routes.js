import express from "express";
import { getConfigTable } from "../controllers/configurations.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();
router.use(authenticate);
router.use(authorize("admin", "shop", "customer"));
router.get("/:tableName", getConfigTable);

export default router;
