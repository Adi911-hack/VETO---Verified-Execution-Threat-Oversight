import { executeGoal } from "./executor.js"

const goal = process.argv.slice(2).join(" ")

if (!goal) {
  console.error('Usage: node testExecutor.js "your goal here"')
  process.exit(1)
}

try {
  const result = await executeGoal(goal)

  console.log("\nVETO EXECUTOR OUTPUT:\n")
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error("\nExecutor error:")
  console.error(error.message)
}