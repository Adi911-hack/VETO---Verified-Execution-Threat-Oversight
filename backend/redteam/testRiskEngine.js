const { redTeamAudit } = require("./riskEngine")

const tests = [
  {
    name: "READ",
    action: {
      type: "READ",
      target: "users"
    }
  },

  {
    name: "DELETE",
    action: {
      type: "DELETE",
      target: "users"
    }
  },

  {
    name: "DROP",
    action: {
      type: "DROP",
      target: "production.users"
    }
  },
  {
    name: "UPDATE ALL",
    action: {
      type: "UPDATE",
      target: "users",
      scope: "ALL"
    }
  },
  {
    name: "UPDATE ONE",
    action: {
      type: "UPDATE",
      target: "users",
      scope: "ONE"
    }
  },
  {
  name: "INVALID",
  action: {}
  }
]

for (const test of tests) {
  console.log("\n====================")
  console.log(test.name)
  console.log("====================")

  console.log(
    JSON.stringify(
      redTeamAudit(test.action),
      null,
      2
    )
  )
}