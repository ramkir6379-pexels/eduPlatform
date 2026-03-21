import { Request, Response } from "express";
import { pool } from "../db";
import { io } from "../server";

export const createLiveQuiz = async (req: Request, res: Response) => {
  try {
    const { question, options, correct_answer, session_id, class_id, teacher_id } = req.body;

    if (!question || !options || !correct_answer || !session_id) {
      return res.status(400).json({
        error: "question, options, correct_answer, and session_id are required",
      });
    }

    if (!teacher_id) {
      return res.status(400).json({ error: "teacher_id required" });
    }

    console.log("REQ BODY:", req.body);
    console.log("QUESTION:", question);
    console.log("OPTIONS:", options);
    console.log("CORRECT_ANSWER:", correct_answer);
    console.log("TEACHER_ID:", teacher_id);

    // Insert live quiz
    const result = await pool.query(
      `
      INSERT INTO quizzes (title, description, is_live, class_id, teacher_id, created_at)
      VALUES ($1, $2, true, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id, title, created_at
      `,
      [question, JSON.stringify(options), class_id || null, teacher_id]
    );

    const quizId = result.rows[0].id;

    // Store the correct answer separately (we'll use a simple approach)
    // For now, we'll store it in the description field as JSON
    await pool.query(
      `
      UPDATE quizzes
      SET description = $1
      WHERE id = $2
      `,
      [JSON.stringify({ options, correct_answer }), quizId]
    );

    const quizData = {
      id: quizId,
      question,
      options,
      correct_answer,
      session_id,
    };

    // Emit to all students in the class via socket
    if (class_id) {
      io.to(String(class_id)).emit("live_quiz", quizData);
    }

    res.json({
      success: true,
      quiz_id: quizId,
      message: "Live quiz created and pushed to students",
    });
  } catch (error) {
    console.error("Error creating live quiz:", error);
    res.status(500).json({ error: "Failed to create live quiz" });
  }
};

export const submitLiveQuizAnswer = async (req: Request, res: Response) => {
  try {
    const { quiz_id, student_id, answer, session_id, class_id } = req.body;

    if (!quiz_id || !student_id || !answer || !session_id) {
      return res.status(400).json({
        error: "quiz_id, student_id, answer, and session_id are required",
      });
    }

    // Get the quiz to check correct answer
    const quizResult = await pool.query(
      `SELECT description FROM quizzes WHERE id = $1`,
      [quiz_id]
    );

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const quizData = JSON.parse(quizResult.rows[0].description || "{}");
    const correct_answer = quizData.correct_answer;
    const isCorrect = answer === correct_answer;
    const score = isCorrect ? 1 : 0;

    // Store submission
    await pool.query(
      `
      INSERT INTO quiz_submissions (quiz_id, student_id, answer, score, session_id, submitted_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      `,
      [quiz_id, student_id, answer, score, session_id]
    );

    // Emit real-time update to teacher
    if (class_id) {
      io.to(String(class_id)).emit("quiz_submission", {
        quiz_id,
        student_id,
        answer,
        isCorrect,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      score,
      isCorrect,
      correct_answer,
    });
  } catch (error) {
    console.error("Error submitting quiz answer:", error);
    res.status(500).json({ error: "Failed to submit answer" });
  }
};

export const getLiveQuizAnalytics = async (req: Request, res: Response) => {
  try {
    const { session_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        AVG(score) as avg_score,
        COUNT(*) as total_submissions,
        SUM(CASE WHEN score = 1 THEN 1 ELSE 0 END) as correct_count,
        COUNT(DISTINCT student_id) as unique_students
      FROM quiz_submissions
      WHERE session_id = $1 AND score IS NOT NULL
      `,
      [session_id]
    );

    const data = result.rows[0] || {
      avg_score: 0,
      total_submissions: 0,
      correct_count: 0,
      unique_students: 0,
    };

    res.json({
      avg_score: Math.round((data.avg_score || 0) * 100),
      total_submissions: data.total_submissions || 0,
      correct_count: data.correct_count || 0,
      unique_students: data.unique_students || 0,
      accuracy: data.total_submissions > 0 
        ? Math.round((data.correct_count / data.total_submissions) * 100)
        : 0,
    });
  } catch (error) {
    console.error("Error fetching live quiz analytics:", error);
    res.status(500).json({ error: "Failed to fetch quiz analytics" });
  }
};
