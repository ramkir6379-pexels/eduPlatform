import express from "express";
import { getAdminStats } from "../controllers/adminController";

const router = express.Router();

router.get("/stats", getAdminStats);

export default router;
