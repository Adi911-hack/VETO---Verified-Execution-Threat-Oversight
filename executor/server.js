import express from "express"
import cors from "cors"
import { executeGoal } from "./executor.js"

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "veto-executor",
  })
})

app.post("/api/execute", async (req, res) => {
  try {
    const { goal } = req.body

    if (!goal || !goal.trim()) {
      return res.status(400).json({
        error: "Goal is required.",
      })
    }

    const action = await executeGoal(goal)

    res.json({
      success: true,
      action,
    })
  } catch (error) {
    console.error("Executor API error:", error)

    res.status(500).json({
      success: false,
      error: "Executor failed.",
      message: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`VETO Executor running at http://localhost:${PORT}`)
})