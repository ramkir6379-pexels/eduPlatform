import express from "express";
import {
  getClassEngagement,
  getEngagementTimeline,
  getStudentEngagement,
  getSessions,
  getClassHealth,
  getEmotionDistribution,
} from "../controllers/analyticsController";

const router = express.Router();

router.get("/sessions", getSessions);
router.get("/class/:sessionId", getClassEngagement);
router.get("/class-health/:sessionId", getClassHealth);
router.get("/timeline/:sessionId", getEngagementTimeline);
router.get("/student-engagement/:sessionId", getStudentEngagement);
router.get("/emotion-distribution/:sessionId", getEmotionDistribution);

export default router;
