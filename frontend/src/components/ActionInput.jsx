function ActionInput({
  goal,
  setGoal,
  sendGoal,
  loading
}) {
  return (
    <div className="card">
      <h2>Agent Goal</h2>

      <p className="card-description">
        Enter the action you want the autonomous agent to execute.
      </p>

      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Example: Delete all unused files from the project..."
      />

      <button
        onClick={sendGoal}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Execute"}
      </button>
    </div>
  )
}

export default ActionInput