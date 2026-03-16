import express from "express";
import { pool } from "../db";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const result = await pool.query(
    "SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC",
    [userId]
  );

  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { userId, message } = req.body;

  await pool.query(
    "INSERT INTO notifications (user_id,message) VALUES ($1,$2)",
    [userId, message]
  );

  res.json({ message: "notification sent" });
});

export default router;
