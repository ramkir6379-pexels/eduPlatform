import { Request, Response } from "express";
import { pool } from "../db";

/* Create Quiz */
export const createQuiz = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    
    const { title, class_id, description } = req.body;
    // Use teacher_id from request body for now (should come from JWT in production)
    let { teacher_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!teacher_id) {
      return res.status(400).json({ error: "teacher_id is required" });
    }

    const result = await pool.query(
      "INSERT INTO quizzes (title, teacher_id, class_id, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, teacher_id, class_id || null, description || null]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

/* Get Quiz by ID */
export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, title, description, teacher_id, class_id FROM quizzes WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

/* Add Question */
export const addQuestion = async (req: Request, res: Response) => {
  try {
    const {
      quiz_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
    } = req.body;

    if (!quiz_id || !question || !correct_answer) {
      return res.status(400).json({ error: "quiz_id, question, and correct_answer are required" });
    }

    const result = await pool.query(
      `INSERT INTO questions
       (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [quiz_id, question, option_a, option_b, option_c, option_d, correct_answer]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Failed to add question" });
  }
};

/* Get Quizzes for a Class */
export const getClassQuizzes = async (req: Request, res: Response) => {
  try {
    const { class_id } = req.params;

    const result = await pool.query(
      `SELECT q.id, q.title, q.description, c.name as class_name
       FROM quizzes q
       LEFT JOIN classes c ON q.class_id = c.id
       WHERE q.class_id = $1`,
      [class_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching class quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

/* Get Questions of a Quiz */
export const getQuizQuestions = async (req: Request, res: Response) => {
  try {
    const { quiz_id } = req.params;

    const result = await pool.query(
      `SELECT id, question, option_a, option_b, option_c, option_d
       FROM questions
       WHERE quiz_id = $1
       ORDER BY id ASC`,
      [quiz_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

/* Submit Quiz */
export const submitQuiz = async (req: Request, res: Response) => {
  const { quiz_id, student_id, answers } = req.body;

  try {
    if (!quiz_id || !student_id || !answers) {
      return res.status(400).json({ error: "quiz_id, student_id, and answers are required" });
    }

    // Get all questions for this quiz
    const questionsResult = await pool.query(
      "SELECT id, correct_answer FROM questions WHERE quiz_id = $1",
      [quiz_id]
    );

    const questions = questionsResult.rows;
    let score = 0;

    // First, create the submission record
    const submissionResult = await pool.query(
      `INSERT INTO quiz_submissions (quiz_id, student_id, score, total_questions)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [quiz_id, student_id, 0, questions.length]
    );

    const submissionId = submissionResult.rows[0].id;

    // Insert each answer and calculate score
    for (const q of questions) {
      const studentAnswer = answers[q.id];
      const isCorrect = studentAnswer === q.correct_answer;

      if (isCorrect) score++;

      // Insert answer record
      await pool.query(
        `INSERT INTO student_answers (submission_id, question_id, selected_option, is_correct)
         VALUES ($1, $2, $3, $4)`,
        [submissionId, q.id, studentAnswer || null, isCorrect]
      );
    }

    // Update submission with final score
    await pool.query(
      `UPDATE quiz_submissions SET score = $1 WHERE id = $2`,
      [score, submissionId]
    );

    res.json({
      success: true,
      score,
      totalQuestions: questions.length,
      percentage: Math.round((score / questions.length) * 100),
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

/* Get All Quizzes */
export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT q.id, q.title, q.description, c.name as class_name
       FROM quizzes q
       LEFT JOIN classes c ON q.class_id = c.id
       ORDER BY q.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching all quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

/* Assign Quiz to Class */
export const assignQuiz = async (req: Request, res: Response) => {
  const { quiz_id, class_id } = req.body;

  try {
    await pool.query(
      "INSERT INTO quiz_assignments (quiz_id, class_id) VALUES ($1,$2)",
      [quiz_id, class_id]
    );

    res.json({ message: "Quiz assigned successfully" });
  } catch (error) {
    console.error("Error assigning quiz:", error);
    res.status(500).json({ error: "Failed to assign quiz" });
  }
};

/* Get Teacher Quizzes */
export const getTeacherQuizzes = async (req: Request, res: Response) => {
  try {
    const { teacher_id } = req.params;

    const result = await pool.query(
      `SELECT q.id, q.title, q.description, c.name as class_name, 
              (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count,
              q.created_at
       FROM quizzes q
       LEFT JOIN classes c ON q.class_id = c.id
       WHERE q.teacher_id = $1
       ORDER BY q.created_at DESC`,
      [teacher_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching teacher quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

/* Delete Quiz */
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM quizzes WHERE id = $1", [id]);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};

/* Get Quiz Results */
export const getQuizResults = async (req: Request, res: Response) => {
  try {
    const { quiz_id } = req.params;

    const result = await pool.query(
      `SELECT 
        u.name as student_name,
        qs.score,
        qs.total_questions,
        ROUND((qs.score::float / NULLIF(qs.total_questions, 0) * 100)::numeric, 2) as percentage,
        qs.created_at as submitted_at
       FROM quiz_submissions qs
       JOIN users u ON u.id = qs.student_id
       WHERE qs.quiz_id = $1
       ORDER BY qs.created_at DESC`,
      [quiz_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ error: "Failed to fetch quiz results" });
  }
};
