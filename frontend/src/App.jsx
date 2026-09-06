import { useState } from "react"

function App() {
  const [goal, setGoal] = useState("")
  const [message, setMessage] = useState("")

  async function sendGoal() {
    const response = await fetch("http://localhost:3000/api/goal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ goal })
    })

    const data = await response.json()
    setMessage(data.message)
  }

  return (
    <div>
      <h1>VETO</h1>
      <p>Autonomous Agent Safety Layer</p>

      <input
        type="text"
        placeholder="Enter a goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <button onClick={sendGoal}>
        Execute
      </button>

      <p>{message}</p>
    </div>
  )
}

export default App
