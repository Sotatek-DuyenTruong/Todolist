import "dotenv/config"
import express from "express"
import cors from "cors"
import multer from "multer"
import { pool } from "./db"
import todosRoutes = require("./todos.routes")

const app = express()
const parseFormData = multer().none()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (_req, res) => {
  res.json({ message: "Todo API is running" });
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/todos", parseFormData, todosRoutes)

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
);

const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});



