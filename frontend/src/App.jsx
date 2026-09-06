import { useState } from "react"
import ActionInput from "./components/ActionInput"
import DecisionPanel from "./components/DecisionPanel"
import RedTeamPanel from "./components/RedTeamPanel"
import "./App.css"

function App() {
  const [goal, setGoal] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("Idle")
  const [loading, setLoading] = useState(false)

  async function sendGoal() {
    if (!goal.trim()) return

    setLoading(true)
    setMessage("")
    setStatus("Analyzing")

    try {
      const response = await fetch("http://localhost:3000/api/goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ goal })
      })

      const data = await response.json()

      setMessage(data.message || "No response received")
      setStatus(data.status || "Completed")
    } catch {
      setMessage("Unable to connect to backend")
      setStatus("Error")
    }

    setLoading(false)
  }

  return (
    <div className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <nav className="navbar">
        <div className="brand">
          <div className="logo">V</div>

          <div>
            <h1>VETO</h1>
            <span>Verified Execution & Threat Oversight</span>
          </div>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          Safety Layer Active
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="hero-label">
            AUTONOMOUS AGENT SECURITY
          </div>

          <h2>
            Stop dangerous AI actions
            <span> before execution.</span>
          </h2>

          <p>
            VETO analyzes autonomous agent goals, challenges risky
            actions and allows only verified execution.
          </p>
        </section>

        <section className="workflow">
          <div className="workflow-item active">
            <span>01</span>
            <div>
              <strong>Agent Goal</strong>
              <p>Action requested</p>
            </div>
          </div>

          <div className="workflow-line"></div>

          <div className="workflow-item">
            <span>02</span>
            <div>
              <strong>Red Team</strong>
              <p>Threat analysis</p>
            </div>
          </div>

          <div className="workflow-line"></div>

          <div className="workflow-item">
            <span>03</span>
            <div>
              <strong>Decision</strong>
              <p>Approve or block</p>
            </div>
          </div>
        </section>

        <section className="dashboard">
          <div className="left-column">
            <ActionInput
              goal={goal}
              setGoal={setGoal}
              sendGoal={sendGoal}
              loading={loading}
            />

            <RedTeamPanel
              status={status}
              goal={goal}
            />
          </div>

          <div className="right-column">
            <DecisionPanel
              status={status}
              message={message}
            />
          </div>
        </section>

        <footer>
          <span>VETO Security Layer</span>
          <span>Multi-Agent Execution Oversight</span>
        </footer>
      </main>
    </div>
  )
}

export default App