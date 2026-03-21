import express from "express";
import cors from "cors";
import multer from "multer";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import classRoutes from "./routes/classes";
import attendanceRoutes from "./routes/attendance";
import quizRoutes from "./routes/quiz";
import liveQuizRoutes from "./routes/liveQuiz";
import notificationRoutes from "./routes/notifications";
import adminRoutes from "./routes/admin";
import engagementRoutes from "./routes/engagement";
import analyticsRoutes from "./routes/analytics";
import { pool } from "./db";
import { initializeDatabase } from "./init-db";
import { migrateDatabase } from "./migrate-db";

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(upload.single("frame"));

let io: any;

// Initialize database and run migrations
const startServer = async () => {
  await initializeDatabase();
  await migrateDatabase();

  app.use("/api", authRoutes);
  app.use("/api", userRoutes);
  app.use("/api", classRoutes);
  app.use("/api", attendanceRoutes);
  app.use("/api/quizzes", quizRoutes);
  app.use("/api/live-quiz", liveQuizRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/engagement", engagementRoutes);
  app.use("/api/analytics", analyticsRoutes);

  app.get("/test-db", async (req, res) => {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  });

  const httpServer = createServer(app);

  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);
    let currentRoom: string | null = null;
    let userRole: string = "student";
    let sessionId: string | null = null;

    socket.on("join-room", (data: any) => {
      const roomId = data.classId || data.roomId || data;
      userRole = data.role || "student";
      sessionId = data.sessionId || null;

      console.log(`${socket.id} joined room ${roomId} as ${userRole}`);
      socket.join(roomId);
      currentRoom = roomId;

      // Also join session room for real-time analytics
      if (sessionId) {
        socket.join(sessionId);
        console.log(`${socket.id} joined session room ${sessionId}`);
      }

      // Notify others in the room with role info
      socket.to(roomId).emit("user-joined", { id: socket.id, role: userRole });
    });

    socket.on("join_session", (sessionId: string) => {
      console.log(`${socket.id} joining session ${sessionId}`);
      socket.join(sessionId);
      console.log(`${socket.id} successfully joined session room ${sessionId}`);
    });

    socket.on("signal", ({ target, data }: any) => {
      io.to(target).emit("signal", { data, from: socket.id });
    });

    socket.on("class-ended", (classId: string) => {
      console.log(`Class ${classId} ended by ${socket.id}`);
      io.to(classId).emit("class-ended");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (currentRoom) {
        socket.to(currentRoom).emit("user-left", socket.id);
      }
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export { io };
