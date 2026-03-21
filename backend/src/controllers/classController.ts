import { Request, Response } from "express";
import { pool } from "../db";

export const getClasses = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT classes.id, classes.name, classes.teacher_id, users.name AS teacher
      FROM classes
      LEFT JOIN users ON classes.teacher_id = users.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, teacher_id } = req.body;

    if (!name || !teacher_id) {
      return res.status(400).json({ error: "Name and teacher_id are required" });
    }

    const result = await pool.query(
      "INSERT INTO classes(name, teacher_id) VALUES($1, $2) RETURNING *",
      [name, teacher_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Failed to create class" });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    const result = await pool.query(
      `
      SELECT classes.id, classes.name, classes.teacher_id, users.name AS teacher
      FROM classes
      LEFT JOIN users ON classes.teacher_id = users.id
      WHERE classes.id = $1
    `,
      [classId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ error: "Failed to fetch class" });
  }
};

export const enrollStudent = async (req: Request, res: Response) => {
  try {
    const { class_id, student_id } = req.body;

    if (!class_id || !student_id) {
      return res.status(400).json({ error: "class_id and student_id are required" });
    }

    const result = await pool.query(
      "INSERT INTO class_students(class_id, student_id) VALUES($1, $2) RETURNING *",
      [class_id, student_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ error: "Failed to enroll student" });
  }
};

export const getTeacherClasses = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.id;

    const result = await pool.query(
      "SELECT id, name, teacher_id FROM classes WHERE teacher_id = $1",
      [teacherId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

export const getStudentClasses = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    const result = await pool.query(
      `
      SELECT classes.id, classes.name, classes.teacher_id
      FROM classes
      JOIN class_students ON classes.id = class_students.class_id
      WHERE class_students.student_id = $1
    `,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching student classes:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    await pool.query("DELETE FROM classes WHERE id = $1", [classId]);

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "Failed to delete class" });
  }
};

export const getClassStudents = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    const result = await pool.query(
      `
      SELECT users.id, users.name, users.email
      FROM users
      JOIN class_students ON users.id = class_students.student_id
      WHERE class_students.class_id = $1
    `,
      [classId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching class students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const startSession = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const sessionId = `class-${classId}-${Date.now()}`;

    const result = await pool.query(
      "UPDATE classes SET active_session_id = $1 WHERE id = $2 RETURNING active_session_id",
      [sessionId, classId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ session_id: result.rows[0].active_session_id });
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ error: "Failed to start session" });
  }
};

export const getActiveSession = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    const result = await pool.query(
      "SELECT active_session_id FROM classes WHERE id = $1",
      [classId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    const sessionId = result.rows[0].active_session_id;
    if (!sessionId) {
      return res.status(404).json({ error: "No active session for this class" });
    }

    res.json({ session_id: sessionId });
  } catch (error) {
    console.error("Error fetching active session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};

export const endSession = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    await pool.query(
      "UPDATE classes SET active_session_id = NULL WHERE id = $1",
      [classId]
    );

    res.json({ message: "Session ended successfully" });
  } catch (error) {
    console.error("Error ending session:", error);
    res.status(500).json({ error: "Failed to end session" });
  }
};

export const getCurrentSession = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    const result = await pool.query(
      `SELECT session_id, is_live, created_at 
       FROM sessions 
       WHERE class_id = $1 AND is_live = true 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [classId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No active session found" });
    }

    res.json({ session_id: result.rows[0].session_id });
  } catch (error) {
    console.error("Error fetching current session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};

export const createNewSession = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const sessionId = `class-${classId}-${Date.now()}`;

    // End any existing live sessions for this class
    await pool.query(
      "UPDATE sessions SET is_live = false, ended_at = CURRENT_TIMESTAMP WHERE class_id = $1 AND is_live = true",
      [classId]
    );

    // Create new session
    const result = await pool.query(
      `INSERT INTO sessions (class_id, session_id, is_live) 
       VALUES ($1, $2, true) 
       RETURNING session_id`,
      [classId, sessionId]
    );

    res.json({ session_id: result.rows[0].session_id });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};

export const endCurrentSession = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    await pool.query(
      "UPDATE sessions SET is_live = false, ended_at = CURRENT_TIMESTAMP WHERE class_id = $1 AND is_live = true",
      [classId]
    );

    res.json({ message: "Session ended successfully" });
  } catch (error) {
    console.error("Error ending session:", error);
    res.status(500).json({ error: "Failed to end session" });
  }
};
