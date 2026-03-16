import { Request, Response } from "express";
import { pool } from "../db";

export const markAttendance = async (req: Request, res: Response) => {
  const { class_id, date, records } = req.body;

  try {
    // If records array is provided, insert multiple records
    if (records && Array.isArray(records)) {
      const values = records
        .map((_, index) => {
          const paramIndex = index * 4;
          return `($${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`;
        })
        .join(",");

      const flatParams = records.flatMap((record) => [
        class_id,
        record.student_id,
        date || new Date().toISOString().split("T")[0],
        record.status,
      ]);

      const query = `
        INSERT INTO attendance(class_id, student_id, date, status)
        VALUES ${values}
        RETURNING *
      `;

      const result = await pool.query(query, flatParams);
      res.json({ success: true, records: result.rows });
    } else {
      // Single record insertion (legacy support)
      const { student_id, status } = req.body;
      const result = await pool.query(
        `INSERT INTO attendance(class_id, student_id, date, status)
         VALUES($1, $2, $3, $4)
         RETURNING *`,
        [class_id, student_id, date || new Date().toISOString().split("T")[0], status]
      );
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

export const getClassStudents = async (req: Request, res: Response) => {
  const classId = req.params.id;

  const result = await pool.query(
    `
    SELECT users.id,users.name
    FROM users
    JOIN class_students
    ON users.id = class_students.student_id
    WHERE class_students.class_id = $1
  `,
    [classId]
  );

  res.json(result.rows);
};

export const getStudentAttendance = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `
    SELECT 
      a.id,
      c.name AS class_name,
      a.date,
      a.status
    FROM attendance a
    JOIN classes c ON a.class_id = c.id
    WHERE a.student_id = $1
    ORDER BY a.date DESC
  `,
    [id]
  );

  res.json(result.rows);
};

export const exportAttendance = async (req: Request, res: Response) => {
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
};
