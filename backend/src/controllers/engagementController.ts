import { Request, Response } from "express";
import axios from "axios";
import FormData from "form-data";

export const receiveFrame = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No frame provided",
      });
    }

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
