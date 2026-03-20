import express from "express";
import {
  getClassEngagement,
  getEngagementTimeline,
  getStudentEngagement,
} from "../controllers/analyticsController";

const router = express.Router();

router.get("/class/:sessionId", getClassEngagement);
router.get("/timeline/:sessionId", getEngagementTimeline);
router.get("/students/:sessionId", getStudentEngagement);

export default router;
