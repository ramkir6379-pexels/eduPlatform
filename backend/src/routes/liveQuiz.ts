import express from "express";
import {
  createLiveQuiz,
  submitLiveQuizAnswer,
  getLiveQuizAnalytics,
} from "../controllers/liveQuizController";

const router = express.Router();

router.post("/create", createLiveQuiz);
router.post("/submit", submitLiveQuizAnswer);
router.get("/analytics/:session_id", getLiveQuizAnalytics);

export default router;
