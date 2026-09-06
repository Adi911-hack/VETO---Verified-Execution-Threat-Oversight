const express = require("express")
const cors = require("cors")
const { redTeamAudit } = require("./redteam/riskEngine")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "VETO backend running" })
})

app.post("/api/goal", (req, res) => {

  const { goal, action } = req.body

  if (!goal) {
    return res.status(400).json({
      success: false,
      message: "Goal is required"
    })
  }

  if (!action) {
    return res.status(400).json({
      success: false,
      message: "Action is required"
    })
  }

  const audit = redTeamAudit(action)

  res.json({
    success: true,
    goal: goal,
    action: action,
    risk: audit.risk,
    verdict: audit.verdict,
    status: audit.status
  })

})

app.listen(3000, () => {
  console.log("VETO backend running on http://localhost:3000")
})