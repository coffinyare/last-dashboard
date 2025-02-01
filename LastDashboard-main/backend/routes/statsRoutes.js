import express from "express";
import { getStats } from "../controller/statsController.js";

const router = express.Router();

// Define the /api/stats route
router.get("/stats", getStats);

export default router;
