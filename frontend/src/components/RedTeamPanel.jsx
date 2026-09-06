function RedTeamPanel({
  status,
  goal
}) {
  return (
    <div className="card">
      <h2>Red-Team Analysis</h2>

      {!goal ? (
        <p className="empty-text">
          No action submitted yet.
        </p>
      ) : (
        <div className="analysis-list">
          <div>
            <span>Goal received</span>
            <strong>Yes</strong>
          </div>

          <div>
            <span>Threat analysis</span>
            <strong>
              {status === "Idle"
                ? "Waiting"
                : status === "Analyzing"
                ? "Running"
                : "Complete"}
            </strong>
          </div>

          <div>
            <span>Execution review</span>
            <strong>
              {status === "Completed"
                ? "Verified"
                : "Pending"}
            </strong>
          </div>
        </div>
      )}
    </div>
  )
}

export default RedTeamPanel