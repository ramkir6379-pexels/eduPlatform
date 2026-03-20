import { Request, Response } from "express";
import { pool } from "../db";

export const getClassEngagement = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      `
      SELECT AVG(engagement_score) as class_engagement
      FROM engagement_events
      WHERE session_id = $1
      `,
      [sessionId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching class engagement:", error);
    res.status(500).json({ error: "Failed to fetch class engagement" });
  }
};

export const getEngagementTimeline = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      `
      SELECT
        DATE_TRUNC('minute', created_at) as time,
        AVG(engagement_score) as engagement
      FROM engagement_events
      WHERE session_id = $1
      GROUP BY time
      ORDER BY time
      `,
      [sessionId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching engagement timeline:", error);
    res.status(500).json({ error: "Failed to fetch engagement timeline" });
  }
};

export const getStudentEngagement = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      `
      SELECT
        student_id,
        AVG(engagement_score) as engagement
      FROM engagement_events
      WHERE session_id = $1
      GROUP BY student_id
      `,
      [sessionId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching student engagement:", error);
    res.status(500).json({ error: "Failed to fetch student engagement" });
  }
};
