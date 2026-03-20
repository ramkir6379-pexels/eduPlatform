import express from "express";
import {
  getClassEngagement,
  getEngagementTimeline,
  getStudentEngagement,
  getSessions,
} from "../controllers/analyticsController";

const router = express.Router();

router.get("/sessions", getSessions);
router.get("/class/:sessionId", getClassEngagement);
router.get("/timeline/:sessionId", getEngagementTimeline);
router.get("/students/:sessionId", getStudentEngagement);

export default router;
