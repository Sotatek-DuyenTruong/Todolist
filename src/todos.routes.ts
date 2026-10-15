import { Router } from "express"
import { pool } from "./db"

const router = Router()

// GET /api/todos
router.get("/", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/todos/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        message: "Invalid ID",
      });
      return;
    }
    const result = await pool.query(
      "SELECT * FROM todos WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Todo not found",
      });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
})

// POST /api/todos
router.post("/", async (req, res, next) => {
  try {
    const title =
      req.body && typeof req.body.title === "string"
        ? req.body.title.trim()
        : "";

    if (!title || title.length > 200) {
      res.status(400).json({
        message: "Title must contain 1-200 characters",
      });
      return;
    }

    const result = await pool.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/todos/:id
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        message: "Invalid ID",
      });
      return;
    }
    const rawCompleted = req.body ? req.body.completed : undefined;
    let completed: boolean | null = null;
    if (typeof rawCompleted === "boolean") {
      completed = rawCompleted;
    } else if (rawCompleted === "true" || rawCompleted === "false") {
      completed = rawCompleted === "true";
    }
    if (completed === null) {
      res.status(400).json({
        message: "Completed must be a boolean",
      });
      return;
    }
    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Todo not found",
      });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export = router