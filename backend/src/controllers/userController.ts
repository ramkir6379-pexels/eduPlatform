import { Request, Response } from "express";
import { pool } from "../db";

export const getUsers = async (req: Request, res: Response) => {
  const result = await pool.query("SELECT id,name,email,role FROM users");
  res.json(result.rows);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const result = await pool.query(
    "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *",
    [name, email, password, role]
  );

  res.json(result.rows[0]);
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  await pool.query("DELETE FROM users WHERE id=$1", [id]);

  res.json({ message: "User deleted" });
};
