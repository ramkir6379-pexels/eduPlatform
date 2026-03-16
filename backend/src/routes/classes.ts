import express from "express";
import {
  getClasses,
  createClass,
  enrollStudent,
  getTeacherClasses,
  getStudentClasses,
  deleteClass,
  getClassStudents,
  getClassById,
} from "../controllers/classController";

const router = express.Router();

// Specific routes first (before generic ones)
router.get("/classes/teacher/:id", getTeacherClasses);
router.get("/classes/student/:id", getStudentClasses);
router.get("/classes/:id/students", getClassStudents);
router.get("/classes/:id", getClassById);
router.delete("/classes/:id", deleteClass);
router.post("/classes/enroll", enrollStudent);
router.post("/classes/join", enrollStudent);

// Generic routes last
router.get("/classes", getClasses);
router.post("/classes", createClass);

export default router;
