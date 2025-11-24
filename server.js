const http = require("http")
const { PrismaClient } = require("@prisma/client")
const { createClient } = require("redis")

// 1. PRISMA (DB)
// Prisma 7 lit automatiquement DATABASE_URL depuis prisma.config.ts
const prisma = new PrismaClient()

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
    // ÉCRIRE DANS LA DB (Via Prisma)
    // On crée une ligne dans la table VisitorLog à chaque visite
    await prisma.visitorLog.create({
      data: {
        message: "Hello from Prisma!",
        userAgent: req.headers["user-agent"] || "Unknown",
      },
    })

    // LIRE LA DB (Compter le total)
    const countDB = await prisma.visitorLog.count()

    // REDIS
    let countRedis = "N/A"
    if (redisClient.isOpen) {
      countRedis = await redisClient.incr("page_views")
    }

    const msg = `
🚀 Stack Pro avec Migrations !
------------------------------
🐘 Lignes en DB (Prisma) : ${countDB}
⚡️ Compteur Redis       : ${countRedis}
🌍 Env                  : ${process.env.NODE_ENV}
    `
    res.end(msg)
  } catch (e) {
    console.error(e)
    res.end(`Erreur: ${e.message}`)
  }
})

const PORT = 3000
server.listen(PORT, () => console.log(`Server running on ${PORT}`))
