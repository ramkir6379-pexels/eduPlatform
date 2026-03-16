import express from "express";
import {
  createQuiz,
  addQuestion,
  getClassQuizzes,
  getQuizQuestions,
  submitQuiz,
  getAllQuizzes,
  assignQuiz,
  getTeacherQuizzes,
  deleteQuiz,
  getQuizById,
  getQuizResults,
} from "../controllers/quizController";

const router = express.Router();

// Specific routes first (before generic :id routes)
router.post("/", createQuiz);
router.post("/question", addQuestion);
router.post("/submit", submitQuiz);
router.post("/assign", assignQuiz);
router.get("/teacher/:teacher_id", getTeacherQuizzes);
router.get("/class/:class_id", getClassQuizzes);
router.get("/questions/:quiz_id", getQuizQuestions);
router.get("/results/:quiz_id", getQuizResults);

// Generic routes last
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.delete("/:id", deleteQuiz);

export default router;
