import { Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";
import { pool } from "../db";

export const receiveFrame = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No frame provided",
      });
    }

    const { class_id, student_id, session_id } = req.body;

    if (!class_id || !student_id) {
      return res.status(400).json({
        error: "class_id and student_id are required",
      });
    }

    console.log("student_id:", student_id);
    console.log("class_id:", class_id);
    console.log("session_id:", session_id);

    const formData = new FormData();
    formData.append("frame", req.file.buffer, {
      filename: "frame.jpg",
      contentType: "image/jpeg",
    });

    const response = await axios.post(
      "https://eduplatform-1.onrender.com/analyze",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const { engagement_score, emotion } = response.data;
    console.log(`AI Score: ${engagement_score} (${emotion})`);

    // Store engagement event in database
    await pool.query(
      `INSERT INTO engagement_events 
        (student_id, class_id, session_id, emotion, engagement_score)
       VALUES ($1, $2, $3, $4, $5)`,
      [student_id, class_id, session_id || null, emotion, engagement_score]
    );

    res.json({
      success: true,
      engagement_score,
      emotion,
    });
  } catch (error) {
    console.error("Error analyzing frame:", error);
    res.status(500).json({
      error: "AI analysis failed",
    });
  }
};
