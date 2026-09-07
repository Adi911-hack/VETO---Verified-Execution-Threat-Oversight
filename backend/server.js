require("dotenv").config()

const express = require("express")
const cors = require("cors")
const supabase = require("./supabase")
const requireAuth = require("./auth")   

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VETO backend running"
  })
})

// Health check
app.get("/api/health", async (req, res) => {
  const { error } = await supabase
    .from("runs")
    .select("id")
    .limit(1)

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }

  res.json({
    success: true,
    message: "Supabase connected"
  })
})

// Create a new VETO run
app.post("/api/runs",requireAuth, async (req, res) => {
  try {
    const { goal } = req.body

    if (!goal || !goal.trim()) {
      return res.status(400).json({
        success: false,
        message: "Goal is required"
      })
    }

    const { data: run, error: runError } = await supabase
      .from("runs")
      .insert([
        {
          goal: goal.trim(),
          user_id: req.user.id,
          status: "received"
        }
      ])
      .select()
      .single()

    if (runError) {
      return res.status(500).json({
        success: false,
        error: runError.message
      })
    }

    const { error: logError } = await supabase
      .from("logs")
      .insert([
        {
          run_id: run.id,
          message: "Goal received",
          event_type: "goal_received"
        }
      ])

    if (logError) {
      console.error("Failed to create goal log:", logError.message)
    }

    res.status(201).json({
      success: true,
      run
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Save an Executor structured action
app.post("/api/actions", requireAuth, async (req, res) => {
  try {
    const {
      run_id,
      action_type,
      target,
      description,
      risk_level,
      verdict,
      reason
    } = req.body

    if (!run_id) {
      return res.status(400).json({
        success: false,
        message: "run_id is required"
      })
    }

    const { data: ownedRun, error: ownedRunError } = await supabase
  .from("runs")
  .select("id")
  .eq("id", run_id)
  .eq("user_id", req.user.id)
  .single()

if (ownedRunError || !ownedRun) {
  return res.status(403).json({
    success: false,
    message: "You do not have access to this run"
  })
}

    const { data: action, error: actionError } = await supabase
      .from("actions")
      .insert([
        {
          run_id,
          action_type: action_type || null,
          target: target || null,
          description: description || null,
          risk_level: risk_level || null,
          verdict: verdict || null,
          reason: reason || null
        }
      ])
      .select()
      .single()

    if (actionError) {
      return res.status(500).json({
        success: false,
        error: actionError.message
      })
    }

    const { error: logError } = await supabase
      .from("logs")
      .insert([
        {
          run_id,
          message: "Executor proposed action",
          event_type: "action_proposed"
        }
      ])

    if (logError) {
      console.error("Failed to create action log:", logError.message)
    }

    res.status(201).json({
      success: true,
      action
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Add a custom timeline log
app.post("/api/logs", requireAuth, async (req, res) => {
  try {
    const { run_id, message, event_type } = req.body

    if (!run_id || !message) {
      return res.status(400).json({
        success: false,
        message: "run_id and message are required"
      })
    }

    const { data: ownedRun, error: ownedRunError } = await supabase
  .from("runs")
  .select("id")
  .eq("id", run_id)
  .eq("user_id", req.user.id)
  .single()

if (ownedRunError || !ownedRun) {
  return res.status(403).json({
    success: false,
    message: "You do not have access to this run"
  })
}

    const { data: log, error: logError } = await supabase
      .from("logs")
      .insert([
        {
          run_id,
          message,
          event_type: event_type || null
        }
      ])
      .select()
      .single()

    if (logError) {
      return res.status(500).json({
        success: false,
        error: logError.message
      })
    }

    res.status(201).json({
      success: true,
      log
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get full run data for the dashboard
app.get("/api/runs/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params

    const { data: run, error: runError } = await supabase
      .from("runs")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single()

    if (runError) {
      return res.status(404).json({
        success: false,
        message: "Run not found",
        error: runError.message
      })
    }

    const { data: actions, error: actionsError } = await supabase
      .from("actions")
      .select("*")
      .eq("run_id", id)
      .order("created_at", { ascending: true })

    if (actionsError) {
      return res.status(500).json({
        success: false,
        error: actionsError.message
      })
    }

    const { data: logs, error: logsError } = await supabase
      .from("logs")
      .select("*")
      .eq("run_id", id)
      .order("created_at", { ascending: true })

    if (logsError) {
      return res.status(500).json({
        success: false,
        error: logsError.message
      })
    }

    res.json({
      success: true,
      run,
      actions,
      logs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Save Risk Engine / Red-Team verdict
app.patch("/api/actions/:id/verdict", requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { risk_level, verdict, reason } = req.body

    const { data: existingAction, error: existingActionError } = await supabase
  .from("actions")
  .select("id, run_id")
  .eq("id", id)
  .single()

if (existingActionError || !existingAction) {
  return res.status(404).json({
    success: false,
    message: "Action not found"
  })
}

const { data: ownedRun, error: ownedRunError } = await supabase
  .from("runs")
  .select("id")
  .eq("id", existingAction.run_id)
  .eq("user_id", req.user.id)
  .single()

if (ownedRunError || !ownedRun) {
  return res.status(403).json({
    success: false,
    message: "You do not have access to this action"
  })
}

    const normalizedVerdict = verdict?.toUpperCase()

    if (!["BLOCK", "APPROVE"].includes(normalizedVerdict)) {
      return res.status(400).json({
        success: false,
        message: "verdict must be BLOCK or APPROVE"
      })
    }

    const { data: action, error: actionError } = await supabase
      .from("actions")
      .update({
        risk_level: risk_level || null,
        verdict: normalizedVerdict,
        reason: reason || null
      })
      .eq("id", id)
      .select()
      .single()

    if (actionError) {
      return res.status(500).json({
        success: false,
        error: actionError.message
      })
    }

    const blocked = normalizedVerdict === "BLOCK"

    const { error: logError } = await supabase
      .from("logs")
      .insert([
        {
          run_id: action.run_id,
          message: blocked ? "Action blocked" : "Action approved",
          event_type: blocked ? "action_blocked" : "action_approved"
        }
      ])

    if (logError) {
      console.error("Failed to create verdict log:", logError.message)
    }

    const { error: runUpdateError } = await supabase
      .from("runs")
      .update({
        status: blocked ? "blocked" : "approved"
      })
      .eq("id", action.run_id)

    if (runUpdateError) {
      return res.status(500).json({
        success: false,
        error: runUpdateError.message
      })
    }

    res.json({
      success: true,
      action
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Mark an approved run as executed
app.patch("/api/runs/:id/execute", requireAuth, async (req, res) => {
  try {
    const { id } = req.params

    const { data: ownedRun, error: ownedRunError } = await supabase
  .from("runs")
  .select("*")
  .eq("id", id)
  .eq("user_id", req.user.id)
  .single()

if (ownedRunError || !ownedRun) {
  return res.status(403).json({
    success: false,
    message: "You do not have access to this run"
  })
}


    

    if (ownedRun.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Run must be approved before execution"
      })
    }

    const { data: updatedRun, error: updateError } = await supabase
      .from("runs")
      .update({
        status: "executed"
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({
        success: false,
        error: updateError.message
      })
    }

    const { error: logError } = await supabase
      .from("logs")
      .insert([
        {
          run_id: id,
          message: "Action executed",
          event_type: "action_executed"
        }
      ])

    if (logError) {
      console.error("Failed to create execution log:", logError.message)
    }

    res.json({
      success: true,
      run: updatedRun
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
})

app.listen(PORT, () => {
  console.log(`VETO backend running on http://localhost:${PORT}`)
})