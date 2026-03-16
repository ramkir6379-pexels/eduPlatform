import { Request, Response } from "express";
import { pool } from "../db";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const students = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role='student'"
    );

    const teachers = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role='teacher'"
    );

    const classes = await pool.query(
      "SELECT COUNT(*) as count FROM classes"
    );

    const quizzes = await pool.query(
      "SELECT COUNT(*) as count FROM quizzes"
    );

    const avgScore = await pool.query(
      "SELECT AVG(score) as avg FROM quiz_submissions"
    );

    const attendance = await pool.query(
      "SELECT COUNT(CASE WHEN status='present' THEN 1 END)::float / NULLIF(COUNT(*), 0) * 100 as rate FROM attendance"
    );

    res.json({
      students: parseInt(students.rows[0].count) || 0,
      teachers: parseInt(teachers.rows[0].count) || 0,
      classes: parseInt(classes.rows[0].count) || 0,
      quizzes: parseInt(quizzes.rows[0].count) || 0,
      avgScore: parseFloat(avgScore.rows[0].avg) || 0,
      attendanceRate: parseFloat(attendance.rows[0].rate) || 0,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
