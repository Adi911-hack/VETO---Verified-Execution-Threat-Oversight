import StatusBadge from "./StatusBadge"

function DecisionPanel({
  status,
  message
}) {
  return (
    <div className="card decision-card">
      <div className="card-header">
        <h2>Final Decision</h2>
        <StatusBadge status={status} />
      </div>

      <div className="decision-content">
        {message ? (
          <p>{message}</p>
        ) : (
          <p className="empty-text">
            Submit a goal to view the safety decision.
          </p>
        )}
      </div>
    </div>
  )
}

export default DecisionPanel