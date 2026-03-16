import { pool } from "./db";

export const migrateDatabase = async () => {
  try {
    console.log("Running database migrations...");

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

    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
  }
};
