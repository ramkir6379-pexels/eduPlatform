import express from "express";
import { pool } from "../db";
import {
  markAttendance,
  getClassStudents,
  getStudentAttendance,
} from "../controllers/attendanceController";

const router = express.Router();

router.post("/attendance", markAttendance);
router.get("/classes/:id/students", getClassStudents);
router.get("/attendance/student/:id", getStudentAttendance);

router.get("/attendance/export/:classId", async (req, res) => {
  const { classId } = req.params;

  const result = await pool.query(
    `SELECT users.name, attendance.date, attendance.status
     FROM attendance
     JOIN users ON users.id = attendance.student_id
     WHERE attendance.class_id = $1`,
    [classId]
  );

  const rows = result.rows;

  let csv = "Name,Date,Status\n";
  rows.forEach((r: any) => {
    csv += `${r.name},${r.date},${r.status}\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");

  res.send(csv);
});

export default router;
