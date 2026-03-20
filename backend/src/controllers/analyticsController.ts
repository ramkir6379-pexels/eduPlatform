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
        TO_CHAR(DATE_TRUNC('minute', created_at), 'HH24:MI:SS') as time,
        AVG(engagement_score) as engagement
      FROM engagement_events
      WHERE session_id = $1
      GROUP BY DATE_TRUNC('minute', created_at)
      ORDER BY DATE_TRUNC('minute', created_at)
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

export const getSessions = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT session_id
      FROM engagement_events
      ORDER BY session_id DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};
