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
        u.name,
        AVG(e.engagement_score) as avg_engagement
      FROM engagement_events e
      JOIN users u ON u.id = e.student_id
      WHERE e.session_id = $1
      GROUP BY u.name
      ORDER BY avg_engagement DESC
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

export const getClassHealth = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      `
      SELECT AVG(engagement_score) as avg_engagement
      FROM engagement_events
      WHERE session_id = $1
      `,
      [sessionId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching class health:", error);
    res.status(500).json({ error: "Failed to fetch class health" });
  }
};

export const getEmotionDistribution = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      `
      SELECT emotion, COUNT(*) as count
      FROM engagement_events
      WHERE session_id = $1
      GROUP BY emotion
      ORDER BY count DESC
      `,
      [sessionId]
    );

    // Generate insight based on emotion distribution
    const total = result.rows.reduce((sum, r) => sum + Number(r.count), 0);
    let insight = "Balanced class";

    if (total > 0) {
      const fear = Number(result.rows.find(r => r.emotion === "fear")?.count || 0);
      const sad = Number(result.rows.find(r => r.emotion === "sad")?.count || 0);
      const angry = Number(result.rows.find(r => r.emotion === "angry")?.count || 0);
      const happy = Number(result.rows.find(r => r.emotion === "happy")?.count || 0);
      const neutral = Number(result.rows.find(r => r.emotion === "neutral")?.count || 0);

      const negativeRatio = (fear + sad + angry) / total;
      const positiveRatio = happy / total;

      if (negativeRatio > 0.5) {
        insight = "Students are struggling";
      } else if (positiveRatio > 0.6) {
        insight = "Class is highly engaged";
      } else if (neutral > total * 0.6) {
        insight = "Class needs more engagement";
      }
    }

    res.json({
      data: result.rows,
      insight,
    });
  } catch (error) {
    console.error("Error fetching emotion distribution:", error);
    res.status(500).json({ error: "Failed to fetch emotion distribution" });
  }
};
