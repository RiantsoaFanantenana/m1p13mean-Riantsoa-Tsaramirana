import express from "express";
import { getConfigTable } from "../controllers/configurations.controller.js";

const router = express.Router();

router.get("/:tableName", getConfigTable);

export default router;
