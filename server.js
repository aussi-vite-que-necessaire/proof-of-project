const http = require("http")
const { drizzle } = require("drizzle-orm/node-postgres")
const { Pool } = require("pg")
const { createClient } = require("redis")
const { visitorLog } = require("./drizzle/schema")

// 1. DRIZZLE (DB) - Simple et direct, pas besoin d'adapter !
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const db = drizzle(pool)

// 2. REDIS (Cache)
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "redis"}:${
    process.env.REDIS_PORT || 6379
  }`,
})
redisClient.on("error", (err) => console.error("Redis Error", err))
redisClient.connect().catch(console.error)

// 3. SERVER
const server = http.createServer(async (req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain; charset=utf-8")

  try {
    // ÉCRIRE DANS LA DB (Via Drizzle) - Simple et direct !
    await db.insert(visitorLog).values({
      message: "Hello from Drizzle!",
      userAgent: req.headers["user-agent"] || "Unknown",
    })

    // LIRE LA DB (Compter le total)
    const result = await db.select().from(visitorLog)
    const countDB = result.length

    // REDIS
    let countRedis = "N/A"
    if (redisClient.isOpen) {
      countRedis = await redisClient.incr("page_views")
    }

    const msg = `
🚀 Stack Pro avec Drizzle !
------------------------------
🐘 Lignes en DB (Drizzle) : ${countDB}
⚡️ Compteur Redis        : ${countRedis}
🌍 Env                   : ${process.env.NODE_ENV}
    `
    res.end(msg)
  } catch (e) {
    console.error(e)
    res.end(`Erreur: ${e.message}`)
  }
})

const PORT = 3000
server.listen(PORT, () => console.log(`Server running on ${PORT}`))
