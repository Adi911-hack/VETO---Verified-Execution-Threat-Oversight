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
      <header className="header">
        <div>
          <h1>VETO</h1>
          <p>Verified Execution and Threat Oversight</p>
        </div>

        <span className="system-badge">Safety Layer Active</span>
      </header>

      <main className="dashboard">
        <section className="left-panel">
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
        </section>

        <section className="right-panel">
          <DecisionPanel
            status={status}
            message={message}
          />
        </section>
      </main>
    </div>
  )
}

export default App