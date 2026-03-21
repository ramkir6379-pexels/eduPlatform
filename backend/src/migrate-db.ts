import { pool } from "./db";

export const migrateDatabase = async () => {
  try {
    console.log("Running database migrations...");

    // Create engagement_events table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS engagement_events (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES users(id),
        class_id INTEGER NOT NULL REFERENCES classes(id),
        session_id VARCHAR(100),
        emotion VARCHAR(50),
        engagement_score FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Created engagement_events table");

    // Add session_id column if it doesn't exist (for existing tables)
    await pool.query(`
      ALTER TABLE engagement_events
      ADD COLUMN IF NOT EXISTS session_id VARCHAR(100)
    `);
    console.log("✓ Added session_id column to engagement_events table");

    // Add teacher_id column if it doesn't exist
    await pool.query(`
      ALTER TABLE quizzes
      ADD COLUMN IF NOT EXISTS teacher_id INTEGER REFERENCES users(id)
    `);
    console.log("✓ Added teacher_id column to quizzes table");

    // Add created_at column if it doesn't exist
    await pool.query(`
      ALTER TABLE quizzes
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log("✓ Added created_at column to quizzes table");

    // Update NULL teacher_id values to default teacher (id = 2)
    await pool.query(`
      UPDATE quizzes
      SET teacher_id = 2
      WHERE teacher_id IS NULL
    `);
    console.log("✓ Updated NULL teacher_id values to default teacher");

    // Set NOT NULL constraint on teacher_id
    await pool.query(`
      ALTER TABLE quizzes
      ALTER COLUMN teacher_id SET NOT NULL
    `);
    console.log("✓ Set NOT NULL constraint on teacher_id");

    // Add session_id to quiz_submissions for live quiz tracking
    await pool.query(`
      ALTER TABLE quiz_submissions
      ADD COLUMN IF NOT EXISTS session_id VARCHAR(100)
    `);
    console.log("✓ Added session_id column to quiz_submissions table");

    // Add is_live flag to quizzes
    await pool.query(`
      ALTER TABLE quizzes
      ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false
    `);
    console.log("✓ Added is_live column to quizzes table");

    // Add answer column to quiz_submissions for live quiz answers
    await pool.query(`
      ALTER TABLE quiz_submissions
      ADD COLUMN IF NOT EXISTS answer VARCHAR(255)
    `);
    console.log("✓ Added answer column to quiz_submissions table");

    // Add total_questions to quiz_submissions
    await pool.query(`
      ALTER TABLE quiz_submissions
      ADD COLUMN IF NOT EXISTS total_questions INTEGER
    `);
    console.log("✓ Added total_questions column to quiz_submissions table");

    // Add active_session_id to classes table for session management
    await pool.query(`
      ALTER TABLE classes
      ADD COLUMN IF NOT EXISTS active_session_id VARCHAR(100)
    `);
    console.log("✓ Added active_session_id column to classes table");

    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
  }
};
