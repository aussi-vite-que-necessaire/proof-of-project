const http = require("http")
const { Client } = require("pg")
const { createClient } = require("redis")

// ==========================================
// 1. CONFIGURATION POSTGRES (Retry Logic)
// ==========================================
const dbConfig = {
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "example",
  database: process.env.POSTGRES_DB || "myapp",
  host: "db",
  port: 5432,
}

let pgClient

const connectPgWithRetry = () => {
  console.log("🐘 Tentative connexion PostgreSQL...")
  pgClient = new Client(dbConfig)
  pgClient
    .connect()
    .then(() => console.log("✅ Connecté à PostgreSQL !"))
    .catch((err) => {
      console.error("❌ Echec PG. Retry dans 5s...", err.message)
      setTimeout(connectPgWithRetry, 5000)
    })
}
connectPgWithRetry()

// ==========================================
// 2. CONFIGURATION REDIS
// ==========================================
const redisClient = createClient({
  // L'URL est construite grâce aux variables du docker-compose
  url: `redis://${process.env.REDIS_HOST || "redis"}:${
    process.env.REDIS_PORT || 6379
  }`,
})

redisClient.on("error", (err) => console.error("❌ Redis Client Error", err))

const connectRedis = async () => {
  console.log("⚡️ Tentative connexion Redis...")
  try {
    await redisClient.connect()
    console.log("✅ Connecté à Redis !")
  } catch (e) {
    console.error("❌ Echec Redis", e)
  }
}
connectRedis()

// ==========================================
// 3. LE SERVEUR HTTP
// ==========================================
const server = http.createServer(async (req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain; charset=utf-8")

  try {
    // --- Test Postgres ---
    let dbTime = "Non connecté"
    if (pgClient) {
      const result = await pgClient.query("SELECT NOW() as now")
      dbTime = result.rows[0].now
    }

    // --- Test Redis (Compteur de visites) ---
    // On incrémente le compteur 'visits'
    let visits = "Non connecté"
    if (redisClient.isOpen) {
      visits = await redisClient.incr("page_views")
    }

    // --- Réponse ---
    const message = `
🚀 Hello from the VPS!
----------------------
🌍 Environment: ${process.env.NODE_ENV}
🐘 DB Time    : ${dbTime}
⚡️ Redis Hits : ${visits}
    `.trim()

    res.end(message)
  } catch (e) {
    res.end(`Erreur interne: ${e.message}`)
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
