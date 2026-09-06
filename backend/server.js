const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "VETO backend running" })
})

app.post("/api/goal", (req, res) => {
  const { goal } = req.body

  res.json({
    success: true,
    goal: goal,
    message: "Goal received by VETO"
  })
})

app.listen(3000, () => {
  console.log("VETO backend running on http://localhost:3000")
})