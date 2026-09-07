import { useState } from "react"
import "./App.css"

function App() {
  const [goal, setGoal] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function sendGoal() {
    if (!goal.trim()) {
      setError("Please enter a goal.")
      setMessage("")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("http://localhost:3001/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: goal.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Request failed")
      }

      setMessage(JSON.stringify(data.action, null, 2))
    } catch (err) {
      console.error(err)
      setError(
        "Could not connect to the VETO backend. Make sure the backend is running."
      )
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      sendGoal()
    }
  }

  return (
    <div className="app">
      <div className="card">
        <h1>VETO</h1>
        <p className="subtitle">Autonomous Agent Safety Layer</p>

        <div className="inputRow">
          <input
            type="text"
            placeholder="Enter a goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button onClick={sendGoal} disabled={loading}>
            {loading ? "Executing..." : "Execute"}
          </button>
        </div>

       {message && (
  <pre className="success">
    {message}
  </pre>
)}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}

export default App