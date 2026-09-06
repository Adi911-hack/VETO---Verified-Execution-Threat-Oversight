function evaluateRisk(action) {
  if (!action || !action.type) {
    return {
      level: "UNKNOWN",
      reason: "Invalid or missing action type"
    }
  }

  const type = action.type.toUpperCase()

  if (type === "READ") {
    return {
      level: "LOW",
      reason: "Read-only operation"
    }
  }

  if (type === "DROP") {
    return {
      level: "CRITICAL",
      reason: "DROP is a destructive operation that can permanently remove a database object"
    }
  }

  if (type === "DELETE") {
    return {
      level: "HIGH",
      reason: "DELETE is a destructive database operation"
    }
  }

  if (type === "UPDATE") {
    const scope = String(action.scope || "").toUpperCase()

    if (
      scope === "ALL" ||
      scope === "MANY" ||
      scope === "MULTIPLE"
    ) {
      return {
        level: "HIGH",
        reason: "UPDATE affects multiple records"
      }
    }

    return {
      level: "MEDIUM",
      reason: "UPDATE modifies existing data"
    }
  }

  return {
    level: "MEDIUM",
    reason: "Unknown operation requires additional review"
  }
}


function redTeamAudit(action) {

  const risk = evaluateRisk(action)

  let verdict
  let status

  if (risk.level === "LOW") {
    verdict = "APPROVE"
    status = "approved"
  } else if (risk.level === "MEDIUM") {
    verdict = "REVIEW"
    status = "review"
  } else {
    verdict = "BLOCK"
    status = "blocked"
  }

  return {
    risk,
    verdict,
    status
  }
}


module.exports = {
  evaluateRisk,
  redTeamAudit
}