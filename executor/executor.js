import { GoogleGenAI } from "@google/genai"
import "dotenv/config"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function executeGoal(goal) {
  if (!goal || !goal.trim()) {
    throw new Error("Goal is required.")
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",

    contents: `
You are the Executor component of VETO
(Verified Execution Threat Oversight).

Your ONLY responsibility is to convert a user's
natural-language goal into a structured proposed action.

Do NOT:
- approve the action
- block the action
- calculate risk
- give a safety verdict

Those responsibilities belong to other VETO components.

User goal:
${goal}
`,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          goal: { type: "string" },
          action: { type: "string" },
          target: { type: "string" },
          parameters: { type: "object" },
          reason: { type: "string" },
        },
        required: [
          "goal",
          "action",
          "target",
          "parameters",
          "reason",
        ],
      },
    },
  })

  if (!response.text) {
    throw new Error("Gemini returned an empty response.")
  }

  return JSON.parse(response.text)
}