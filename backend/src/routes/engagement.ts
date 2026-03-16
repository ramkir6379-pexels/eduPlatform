import express from "express";
import { receiveFrame } from "../controllers/engagementController";

const router = express.Router();

router.post("/frame", receiveFrame);

export default router;
