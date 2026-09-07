const { createClient } = require("@supabase/supabase-js")

const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      })
    }

    const token = authHeader.substring(7)

    const {
      data: { user },
      error
    } = await authClient.auth.getUser(token)

    if (error || !user) {
      console.error("Auth error:", error?.message)

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error.message)

    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = requireAuth